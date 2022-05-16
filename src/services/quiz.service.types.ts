import { Quiz } from "../models/quiz";

export type GetQuizzesByEmail = (
  email: string,
  converter?: FirebaseFirestore.FirestoreDataConverter<Quiz>
) => Promise<Quiz[]>;

export type CreateQuiz = (
  email: string,
  quiz: Quiz,
  converter?: FirebaseFirestore.FirestoreDataConverter<Quiz>
) => Promise<Quiz[]>;

export type GetQuizByPermalinkId = (
  permalinkId: string,
  converter?: FirebaseFirestore.FirestoreDataConverter<Quiz>
) => Promise<Quiz>;

export type UpdateQuiz = (
  email: string,
  permalinkId: string,
  quiz: Quiz,
  converter?: FirebaseFirestore.FirestoreDataConverter<Quiz>
) => Promise<Quiz>;

export type QuestionAnswer = {
  id: string;
  choices: string[];
};

export type QuizAnswer = {
  permalinkId: string;
  answers: QuestionAnswer[];
};

export type QuizResult = {
  correct: number;
};

export type QuizResultHandler = (answer: QuizAnswer) => Promise<QuizResult>;
export type DeleteQuiz = (permalinkId: string) => Promise<void>;
