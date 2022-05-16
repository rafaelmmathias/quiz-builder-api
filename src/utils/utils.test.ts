import { Question } from "../models/quiz";
import { getCorrectAnswers } from ".";
import { QuestionAnswer } from "../services/quiz.service.types";

const questions: Question[] = [
  {
    id: "question-1",
    title: "Quetion 1",
    type: "single",
    choices: [
      {
        title: "question-1-choice-1",
        isCorrect: true,
      },
      {
        title: "question-1-choice-2",
        isCorrect: false,
      },
    ],
  },
  {
    id: "question-2",
    title: "Quetion 2",
    type: "multi",
    choices: [
      {
        title: "question-2-choice-1",
        isCorrect: true,
      },
      {
        title: "question-2-choice-2",
        isCorrect: true,
      },
    ],
  },
  {
    id: "question-3",
    title: "Quetion 3",
    type: "multi",
    choices: [
      {
        title: "question-3-choice-1",
        isCorrect: true,
      },
      {
        title: "question-3-choice-2",
        isCorrect: false,
      },
      {
        title: "question-3-choice-3",
        isCorrect: true,
      },
    ],
  },
];

test("should validate all answers as correct", () => {
  const answers: QuestionAnswer[] = [
    {
      id: "question-1",
      choices: ["question-1-choice-1"],
    },
    {
      id: "question-2",
      choices: ["question-2-choice-1", "question-2-choice-2"],
    },
    {
      id: "question-3",
      choices: ["question-3-choice-1", "question-3-choice-3"],
    },
  ];

  const { correct } = getCorrectAnswers(questions, answers);

  expect(correct).toBe(3);
});

test("should validate as wrong in multi answers question (selecting all possible options)", () => {
  const answers: QuestionAnswer[] = [
    {
      id: "question-3",
      choices: [
        "question-3-choice-1",
        "question-3-choice-2",
        "question-3-choice-3",
      ],
    },
  ];

  const { correct } = getCorrectAnswers(questions, answers);

  expect(correct).toBe(0);
});

test("should validate as wrong in multi answers question (selecting nothing)", () => {
  const answers: QuestionAnswer[] = [
    {
      id: "question-3",
      choices: [],
    },
  ];

  const { correct } = getCorrectAnswers(questions, answers);

  expect(correct).toBe(0);
});

test("should validates as wrong in single question type", () => {
  const answers: QuestionAnswer[] = [
    {
      id: "question-1",
      choices: ["question-1-choice-2"],
    },
  ];

  const { correct } = getCorrectAnswers(questions, answers);

  expect(correct).toBe(0);
});
