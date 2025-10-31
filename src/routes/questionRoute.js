import express from "express";
import {
  getAllQuestions,
  createQuestion,
  getQuestionsBySurvey,
  updateQuestionText,
  deleteQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

// get all questions
router.get("/", getAllQuestions);

// get questions by survey
router.get("/:survey_id", getQuestionsBySurvey);

// create question
router.post("/", createQuestion);

// update question text
router.put("/:id", updateQuestionText);

// delete question
router.delete("/:id", deleteQuestion);

export default router;
