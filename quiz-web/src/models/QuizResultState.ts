import { Quiz } from "./Quiz";
import { UserAnswers } from "./UserAnswers";

export type QuizResultState = {
  answers: UserAnswers;
  quiz: Quiz;
};