import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addTimeline,
  deleteTimeLine,
  getAllTimline,
  getTimeline,
  updateTimeline,
} from "../controller/timelineController.js";

const router = express.Router();

router.post("/add", isAuthenticated, addTimeline);
router.get("/getAll", getAllTimline);
router.put("/update/:id", isAuthenticated, updateTimeline);
router.delete("/delete/:id", isAuthenticated, deleteTimeLine);
router.get("/get/:id", getTimeline);

export default router;
