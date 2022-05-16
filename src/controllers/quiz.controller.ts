import { RequestHandler } from "express";
import { pick } from "lodash";
import { Quiz } from "../models/quiz";
import {
  getQuizResult,
  createQuiz,
  deleteQuiz,
  getQuizByPermalinkId,
  getQuizzesByEmail,
  updateQuiz,
} from "../services/quiz.service";
import { Timestamp } from "firebase-admin/firestore";
import { generatePermalinkId } from "../utils";
import { QuizNotFoundException } from "../models/errors";
import { QuizAnswer } from "../services/quiz.service.types";
import { quizSchema } from "./quiz.validations";

const fromFirestoreConverter = (
  snapshot: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
) => {
  const data = snapshot.data() as Quiz;
  const typeOfDate = typeof data.createdAt;
  const date =
    typeOfDate === "string"
      ? Timestamp.fromDate(new Date(data.createdAt as string))
      : (data.createdAt as Timestamp);

  return {
    ...data,
    createdAt: date.toDate(),
  };
};

const listConverter: FirebaseFirestore.FirestoreDataConverter<Quiz> = {
  toFirestore: (data) => {
    return data;
  },
  fromFirestore: fromFirestoreConverter,
};

export const get: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user;

    res.json(await getQuizzesByEmail(user.email, listConverter));
  } catch (err) {
    next(err);
  }
};

const createConverter: FirebaseFirestore.FirestoreDataConverter<Quiz> = {
  toFirestore: (data) => {
    const id = generatePermalinkId();
    const createdAt = new Date(data.createdAt as string || new Date());
    
    return {
      ...data,
      permalinkId: data.permalinkId || id,
      createdAt: Timestamp.fromDate(createdAt),
      questions: data.questions.map((question) => ({
        ...question,
        id: question.id || generatePermalinkId(),
      })),
    } as Quiz;
  },
  fromFirestore: fromFirestoreConverter,
};

export const create: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const quiz = req.body as Quiz;
    await quizSchema.validate(quiz);

    const response = await createQuiz(user.email, quiz, createConverter);
    res.json(response);
  } catch (err) {
    next(err);
  }
};

const getQuizConverter: FirebaseFirestore.FirestoreDataConverter<Quiz> = {
  toFirestore: (data) => {
    return data;
  },
  fromFirestore: (snapshot) => {
    const data = snapshot.data() as Quiz;
    const typeOfDate = typeof data.createdAt;
    const date =
      typeOfDate === "string"
        ? Timestamp.fromDate(new Date(data.createdAt as string))
        : (data.createdAt as Timestamp);

    return {
      ...data,
      createdAt: date.toDate(),
      questions: data.questions?.map((question) => ({
        ...question,
        choices: question.choices?.map((choice) => pick(choice, ["title"])),
      })),
    };
  },
};

export const getQuiz: RequestHandler = async (req, res, next) => {
  try {
    const response = await getQuizByPermalinkId(
      req.params.permalinkId,
      getQuizConverter
    );

    if (!response.published) {
      throw QuizNotFoundException;
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const updateQuizController: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const quiz = req.body as Quiz;

    const response = await updateQuiz(
      user.email,
      req.params.permalinkId,
      quiz,
      createConverter
    );

    if (!response) {
      throw QuizNotFoundException;
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const getQuizResultController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const quizAnswer = req.body as QuizAnswer;

    const response = await getQuizResult(quizAnswer);

    if (!response) {
      throw QuizNotFoundException;
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const deleteQuizController: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user;
    await deleteQuiz(req.params.permalinkId);
    const updatedList = await getQuizzesByEmail(user.email, getQuizConverter);

    res.json(updatedList);
  } catch (err) {
    next(err);
  }
};
