import express from "express";
import {
  addProject,
  deleteProject,
  getAllProject,
  getProject,
  updateProject,
} from "../controller/projectController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuthenticated, addProject);
router.put("/update/:id", isAuthenticated, updateProject);
router.get("/getAll", getAllProject);
router.get("/getProject/:id", getProject);
router.delete("/delete/:id", isAuthenticated, deleteProject);

export default router;
