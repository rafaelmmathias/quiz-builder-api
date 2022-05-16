import { QuestionAnswer, QuizResult } from "../services/quiz.service.types";
import { v4 as uuidv4 } from "uuid";
import { Question } from "../models/quiz";

export const generatePermalinkId = () => {
  return uuidv4().replace(/-/g, "").slice(0, 6);
};

export const getCorrectAnswers = (
  questions: Question[],
  answers: QuestionAnswer[]
) => {
  return answers.reduce(
    (acc, curr) => {
      const question = questions.find((question) => question.id === curr.id);
      if (question) {
        const correctOptions = question.choices.filter(
          (option) => option.isCorrect
        );
        const incorrectOptions = question.choices.filter(
          (option) => !option.isCorrect
        );

        const selectedAllCorrects = correctOptions.every((correct) =>
          curr.choices.includes(correct.title)
        );
        const selectedAnyIncorrect = incorrectOptions.some((incorrect) =>
          curr.choices.includes(incorrect.title)
        );

        const isValidAnswers = selectedAllCorrects && !selectedAnyIncorrect;

        acc.correct = isValidAnswers ? acc.correct + 1 : acc.correct;
        return acc;
      }

      return acc;
    },
    {
      correct: 0,
    } as QuizResult
  );
};
