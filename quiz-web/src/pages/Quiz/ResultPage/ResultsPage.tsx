import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ResultsPage.module.scss";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { QuizResultState } from "../../../models/quiz/QuizResultState";
import { QuizService } from "../../../api/services/QuizService";
import useQuizResults from "../../../hooks/useQuizResults";
import { globalCache } from "../../../hooks/useCachedFetch";
import RatingStars from "../../../components/ratingStars/RatingStars";

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
      globalCache.delete("topQuizzes");
      console.log("Delete cache topQuizzes: ", JSON.stringify(globalCache));
      toast.success("Review was sent", { position: "top-right" });
    } catch (error) {
      toast.error("Failed to send review", { position: "top-right" });
    }
  };

  const handleExit = async () => {
    try {
      await QuizService.doneQuiz(quiz.id).then((result) => {
        toast.success(result.message, { position: "top-right" });
        navigate("/home");
      })
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
            <RatingStars setRating={setQuizRating} rating={quizRating} />
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