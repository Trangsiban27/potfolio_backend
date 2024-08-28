import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addSkill,
  deleteSkill,
  getAllSkill,
  getSkill,
  updateSkill,
} from "../controller/skillController.js";

const router = express.Router();

router.post("/add", isAuthenticated, addSkill);
router.put("/update/:id", isAuthenticated, updateSkill);
router.get("/getAll", getAllSkill);
router.delete("/delete/:id", isAuthenticated, deleteSkill);
router.get("/get/:id", getSkill);

export default router;
