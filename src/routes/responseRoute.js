import express from "express";
import {
  getAllResponses,
  getResponsesByQuestion,
  createResponse,
  updateResponseAnswer,
  deleteResponse,
} from "../controllers/responseController.js";

const router = express.Router();

router.get("/", getAllResponses);
router.get("/:questionId", getResponsesByQuestion);
router.post("/", createResponse);
router.put("/:id", updateResponseAnswer);
router.delete("/:id", deleteResponse);

export default router;
