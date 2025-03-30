import { useMemo } from "react";
import { QuizTask } from "../models/QuizTask";
import { UserAnswers } from "../models/UserAnswers";

const useQuizResults = (quizTasks: QuizTask[], userAnswers: UserAnswers) => {
  return useMemo(() => {
    let correctUserAnswers = 0;
    let correctAnswers = 0;

    quizTasks.forEach((question) => {
      const userAnswer = userAnswers[question.id];
      const correctAnswer = question.correctAnswers;

      correctAnswers += correctAnswer.length;
      if (userAnswer) {
        correctUserAnswers += correctAnswer.filter((answer) =>
          userAnswer.includes(answer)
        ).length;
      }
    });

    return Math.round((correctUserAnswers / correctAnswers) * 100);
  }, [quizTasks, userAnswers]);
};

export default useQuizResults;
