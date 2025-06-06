import { Quiz } from "./Quiz";
import { UserAnswers } from "../user/UserAnswers";

export type QuizResultState = {
  answers: UserAnswers;
  quiz: Quiz;
};