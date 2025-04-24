import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ResultsPage.module.scss";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { QuizResultState } from "../../../models/QuizResultState";
import { QuizService } from "../../../api/services/QuizService";
import useQuizResults from "../../../hooks/useQuizResults";

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { answers, quiz } = location.state as QuizResultState;
  const [quizRating, setQuizRating] = useState(0);
  const [comment, setComment] = useState("");
  const quizScore = useQuizResults(quiz.tasks, answers);

  const handleSubmit = async () => {
    try {
      await QuizService.sendReview(quiz.id, quizRating, comment);
      toast.success("Review was sent", { position: "top-right" });
    } catch (error) {
      toast.error("Failed to send review", { position: "top-right" });
    }
  };
  
  const handleExit = async () => {
    try {
      await QuizService.doneQuiz(quiz.id, quizScore());
      toast.success("Quiz done", { position: "top-right" });
      navigate("/home");
    } catch (error) {
      toast.error("Error finishing the quiz", { position: "top-right" });
    }
  };

  return (
    <div className={styles.resultsContainer}>
      <button className={styles.exitButton} onClick={handleExit}>
        <FaTimes />
      </button>

      <div className={styles.resultsCard}>
        <h1 className={styles.quizTitle}>{quiz.title}</h1>
        <p className={styles.percentage}>{quizScore()} %</p>

        <div className={styles.ratingSection_container}>
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
    </div>
  );
};

export default ResultsPage;