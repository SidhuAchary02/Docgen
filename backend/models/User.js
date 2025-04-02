import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      // only require for local User
      return this.provider === "local";
    },
  },
  plan: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    default: "local",
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true, // allow nulll values for local user
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("User", userSchema);
