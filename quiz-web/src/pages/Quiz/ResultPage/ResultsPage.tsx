import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ResultsPage.module.scss";
import { FaTimes } from "react-icons/fa";
import { UserAnswers } from "../../../models/UserAnswers";
import { QuizTask } from "../../../models/QuizTask";
import { QuizResultState } from "../QuizPage/QuizPage";


const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { answers, quiz } = location.state as QuizResultState;
  console.log(answers, quiz)
  const [quizRating, setQuizRating] = useState(0);
  const [authorRating, setAuthorRating] = useState(0);
  const [comment, setComment] = useState("");

  const calculateCorrectAnswers = (quizQuestions: QuizTask[], userAnswers: UserAnswers): number => {
    let correctUserAnswers = 0;
    let correctAnswers = 0;

    quizQuestions.forEach((question) => {
      const userAnswer = userAnswers[question.id];
      const correctAnswer = question.correctAnswers;

      console.log("===", userAnswer, correctAnswer)
      correctAnswers += correctAnswer.length;
      if (userAnswer != null) {
        correctAnswer.map((answer) => {
          if (userAnswer.includes(answer)) {
            correctUserAnswers++;
          }
        })
      }
    }
    );

    return Math.round((correctUserAnswers / correctAnswers) * 100);
  };

  const handleSubmit = () => {
    console.log("Отзыв отправлен:", { quizRating, authorRating, comment });
    // TODO: send feetback
    navigate("/home");
  };

  const handleExit = (): void => {
    navigate("/home");
  };

  return (
    <div className={styles.resultsContainer}>
      <button className={styles.exitButton} onClick={handleExit}>
        <FaTimes />
      </button>
      <div className={styles.resultsCard}>
        <h1 className={styles.quizTitle}>{quiz.title}</h1>
        <p className={styles.percentage}>{calculateCorrectAnswers(quiz.tasks, answers)} %</p>

        <div className={styles.ratingSection}>
          <p>Rate the quiz:</p>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= quizRating ? styles.filledStar : styles.emptyStar}
                onClick={() => setQuizRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <p>Rate the author:</p>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= authorRating ? styles.filledStar : styles.emptyStar}
                onClick={() => setAuthorRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <textarea
          className={styles.commentBox}
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <button className={styles.submitButton} onClick={handleSubmit}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;