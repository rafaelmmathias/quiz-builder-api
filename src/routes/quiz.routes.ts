import {
  deleteQuizController,
  getQuiz,
  getQuizResultController,
  updateQuizController,
} from "./../controllers/quiz.controller";
import express from "express";
import { authorize } from "../middlewares/authorize";
import { create, get } from "../controllers/quiz.controller";

export const quizRouter = express.Router();

quizRouter.get("/quiz/:permalinkId", getQuiz);
quizRouter.post("/quiz/getQuizResult", getQuizResultController);

quizRouter.get("/quiz", authorize, get);
quizRouter.post("/quiz", authorize, create);
quizRouter.put("/quiz/:permalinkId", authorize, updateQuizController);
quizRouter.delete("/quiz/:permalinkId", authorize, deleteQuizController);
