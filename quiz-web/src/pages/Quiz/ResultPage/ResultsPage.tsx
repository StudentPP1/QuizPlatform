import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ResultsPage.module.scss";
import { FaTimes } from "react-icons/fa";
import { AnswersType, QuestionType } from "../QuizPage/QuizPage";

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { answers, quiz } = location.state;

  const [quizRating, setQuizRating] = useState(0);
  const [authorRating, setAuthorRating] = useState(0);
  const [comment, setComment] = useState("");

  const calculateCorrectAnswers = (quizQuestions: QuestionType[], userAnswers: AnswersType[]): number => {
    let correctCount = 0;

    quizQuestions.forEach((question) => {
      const userAnswer = userAnswers[question.id];
      const correctAnswer = question.correct;

      if (Array.isArray(correctAnswer)) {
        if (
          Array.isArray(userAnswer) &&
          userAnswer.length === correctAnswer.length &&
          userAnswer.every((answer) => correctAnswer.includes(answer))
        ) {
          correctCount++;
        }
      } else {
        if (userAnswer === correctAnswer) {
          correctCount++;
        }
      }
    });

    return Math.round((correctCount / quizQuestions.length) * 100);
  };

  const handleSubmit = () => {
    console.log("Отзыв отправлен:", { quizRating, authorRating, comment });
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
        <p className={styles.percentage}>{calculateCorrectAnswers(quiz.questions, answers)} %</p>

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