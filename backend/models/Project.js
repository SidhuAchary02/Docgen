import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    username: { type: String, required: true }, // GitHub username
    repoId: { type: String, required: true, unique: true }, // Unique Repo ID
    repoName: { type: String, required: true }, // Repository Name
    repoURL: { type: String, required: true }, // GitHub Repo URL
    branchName: { type: String, required: true }, // Branch Name
    projectName: { type: String, required: true }, // User-defined Project Name
    detectedLanguages: [
      {
        name: { type: String, required: true },
        size: { type: Number, required: true },
        percentage: { type: String, required: true },
      },
    ],
    createdAt: { type: Date, default: Date.now }, // Timestamp
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
