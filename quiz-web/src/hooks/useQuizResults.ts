import { QuizTask } from "./../models/QuizTask";
import { useMemo } from "react";
import { UserAnswers } from "../models/UserAnswers";

const useQuizResults = (quizTasks: QuizTask[], userAnswers: UserAnswers) => {
  return useMemo(() => {
    let correctUserAnswers = 0;
    let correctAnswers = 0;
    
    // TODO: Task 1 => implement for ... of loop to iterate over quizTasks

    for (const question of quizTasks) {
      const userAnswer = userAnswers[question.id];
      const correctAnswer = question.correctAnswers;

      correctAnswers += correctAnswer.length;
      if (userAnswer) {
        for (const answer of userAnswer) {
          if (correctAnswer.includes(answer)) {
            correctUserAnswers++;
          }
        }
      }
    }
    return Math.round((correctUserAnswers / correctAnswers) * 100);
  }, [quizTasks, userAnswers]);
};

export default useQuizResults;
