export const ensureAuth = (req, res, next) => {
  if (!req.user) {
    console.log(req.user);
    return res.status(401).json({ message: "User not authenticate" });
  }
  

  let accessToken = req.user.accessToken;

  if (!accessToken) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.split(" ")[1];
    }
  }

  if (!accessToken) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  req.accessToken = accessToken;
  next();
};

// import jwt from "jsonwebtoken";

// export const ensureAuth = (req, res, next) => {
//   let accessToken = req.cookies.accessToken; // Extract access token from cookies

//   if (!accessToken) {
//     // Fallback to Authorization header if cookie is not present
//     const authHeader = req.headers.authorization;
//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       accessToken = authHeader.split(" ")[1];
//     }
//   }

//   if (!accessToken) {
//     return res.status(401).json({ message: "Access token is missing" });
//   }

//   try {
//     // Verify the access token
//     const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
//     req.user = decoded; // Attach the decoded user to the request object
//     req.accessToken = accessToken; // Attach the access token to the request object
//     next();
//   } catch (error) {
//     console.error("Error verifying access token:", error);
//     res.status(401).json({ message: "Invalid access token" });
//   }
// };
