import { Quiz } from "../models/quiz";
import {
  QuizAlreadyPublishedException,
  QuizNotFoundException,
} from "../models/errors";

import { firestoreAdmin } from "../server";
import {
  QuizResultHandler,
  CreateQuiz,
  DeleteQuiz,
  GetQuizByPermalinkId,
  GetQuizzesByEmail,
  UpdateQuiz,
} from "./quiz.service.types";
import { getCorrectAnswers } from "../utils";

export const getQuizzesByEmail: GetQuizzesByEmail = async (
  email,
  converter
) => {
  const collection = firestoreAdmin
    .collection("quizzes")
    .where("createdBy", "==", email)
    .orderBy("createdAt", "desc")
    .withConverter(converter);

  const quizzes = await collection.get();

  return quizzes.docs.map((doc) => doc.data());
};

export const getQuizByPermalinkId: GetQuizByPermalinkId = async (
  permalinkId,
  converter
) => {
  const response = await firestoreAdmin
    .collection("quizzes")
    .where("permalinkId", "==", permalinkId)
    .withConverter(converter)
    .get();

  if (response.docs.length > 0) {
    const quiz = response.docs[0].data();

    return quiz;
  }

  throw QuizNotFoundException;
};

export const createQuiz: CreateQuiz = async (email, quiz, converter) => {
  quiz.createdBy = email;
  await firestoreAdmin.collection("quizzes").withConverter(converter).add(quiz);

  return await getQuizzesByEmail(email, converter);
};

export const updateQuiz: UpdateQuiz = async (
  email,
  permalinkId,
  quiz,
  converter
) => {
  const collection = await firestoreAdmin
    .collection("quizzes")
    .where("createdBy", "==", email)
    .where("permalinkId", "==", permalinkId)
    .get();

  if (collection.docs.length === 1) {
    const quizToUpdate = collection.docs[0];
    const quizData = quizToUpdate.data() as Quiz;
    if (quizData.published) throw QuizAlreadyPublishedException;

    await firestoreAdmin
      .collection("quizzes")
      .withConverter(converter)
      .doc(quizToUpdate.id)
      .set(quiz);

    return (
      await firestoreAdmin.collection("quizzes").doc(quizToUpdate.id).get()
    ).data() as Quiz;
  } else {
    throw QuizNotFoundException;
  }
};

export const getQuizResult: QuizResultHandler = async (quizAnswer) => {
  const quiz = await getQuizByPermalinkId(quizAnswer.permalinkId);
  if (!quiz) throw QuizNotFoundException;
  if (!quiz.published) return null;

  return getCorrectAnswers(quiz.questions, quizAnswer.answers);
};

export const deleteQuiz: DeleteQuiz = async (permalinkId) => {
  const response = await firestoreAdmin
    .collection("quizzes")
    .where("permalinkId", "==", permalinkId)
    .get();

  if (response.docs.length > 0) {
    const quiz = response.docs[0];
    await quiz.ref.delete();
  } else {
    throw QuizNotFoundException;
  }
};
