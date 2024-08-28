import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  githubLink: {
    type: String,
    required: true,
  },
  technologies: {
    type: String,
    required: true,
  },
  banner: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
});

export const Project = mongoose.model("Project", projectSchema);
