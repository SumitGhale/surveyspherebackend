import express from "express";
import {
  getAllSurveys,
  createSurvey,
  updateSurveyTitle,
  deleteSurvey,
} from "../controllers/surveyController.js";

const router = express.Router();

// get all surveys:
router.get("/:userId", getAllSurveys);

// create a new survey:
router.post("/", createSurvey);

//  update survey
router.put("/:id", updateSurveyTitle);

//  delete survey
router.delete("/:id", deleteSurvey);
export default router;
