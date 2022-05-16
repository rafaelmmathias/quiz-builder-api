import { Timestamp } from "firebase-admin/firestore";

export type Choice = {
  title: string;
  isCorrect?: boolean;
};

export type Question = {
  id: string;
  title: string;
  choices: Choice[];
  type: "single" | "multi";
};

export type Quiz = {
  title: string;
  published: boolean;
  permalinkId: string;
  createdAt?: Timestamp | Date | string;
  createdBy?: string;
  questions: Question[];
};
