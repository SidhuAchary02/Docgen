import express from "express";
import axios from "axios";
import * as acorn from "acorn";
import * as acornWalk from "acorn-walk";
import bodyParser from "body-parser";

const router = express.Router();
router.use(bodyParser.json())


const GITHUB_API = "https://api.github.com/repos";

// Function to extract function details
const extractFunctions = (code) => {
  const parsed = acorn.parse(code, { ecmaVersion: 2020, locations: true });
  const functions = [];

  acornWalk.simple(parsed, {
    FunctionDeclaration(node) {
      functions.push({
        name: node.id.name,
        params: node.params.map((param) => param.name),
        startLine: node.loc.start.line,
      });
    },
  });

  return functions;
};

// Fetch and parse repo file
// router.get("/generate-docs", async (req, res) => {
//   const { username, repo, filePath, branch = "main" } = req.query;

//   try {
//     const response = await axios.get(
//       `${GITHUB_API}/${username}/${repo}/contents/${filePath}?ref=${branch}`,
//       {
//         headers: {
//           Authorization: `Bearer YOUR_GITHUB_ACCESS_TOKEN`,
//         },
//       }
//     );

//     const fileContent = Buffer.from(response.data.content, "base64").toString("utf-8");
//     const functions = extractFunctions(fileContent);

//     res.json({
//       filePath,
//       functions,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching or parsing file" });
//   }
// });

router.post("/generate-docs", async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: "No code provided" });
        }

        const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "module" });

        const docs = [];
        ast.body.forEach(node => {
            if (node.type === "FunctionDeclaration") {
                const functionName = node.id.name;
                const params = node.params.map(param => param.name);
                docs.push({ functionName, params });
            }
        });

        res.json({ documentation: docs });
    } catch (error) {
        res.status(500).json({ error: "Failed to parse code" });
    }
});

export default router;
