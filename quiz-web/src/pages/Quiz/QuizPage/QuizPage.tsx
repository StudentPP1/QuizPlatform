import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./QuizPage.module.scss";
import { UserAnswers } from "../../../models/UserAnswers";
import { Quiz } from "../../../models/Quiz";
import { QuizNavigate } from "../../QuizInfoPage/QuizInfoPage";

export type QuizResultState = {
  answers: UserAnswers;
  quiz: Quiz;
};

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quiz } = location.state as QuizNavigate;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [timeLeft, setTimeLeft] = useState<number>(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.warn("You didn't have time to complete the quest!");
          navigate(`/quizInfo/${quiz.id}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const question = quiz.tasks[currentQuestionIndex];

  const handleNext = (): void => {
    if (currentQuestionIndex < quiz.tasks.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate("/results", { state: { answers, quiz } as QuizResultState });
    }
  };

  const handleExit = (): void => {
    navigate("/home");
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = event.target;
    if (question.type === "multiple-choice") {
      setAnswers((prev) => {
        const selected = (prev[question.id] as string[]) || [];
        return {
          ...prev,
          [question.id]: checked
            ? [...selected, value]
            : selected.filter((item) => item !== value),
        };
      });
    } else {
      setAnswers((prev) => {
        return {
          ...prev, [question.id]: [value]
        }
      });
    }
  };

  return (
    <div className={styles.quizContainer}>
      <button className={styles.exitButton} onClick={handleExit}>
        <FaTimes />
      </button>
      <div className={styles.quizCard}>
        <h3 className={styles.questionNumber}>
          Question {currentQuestionIndex + 1} / {quiz.tasks.length}
        </h3>
        <h3 className={styles.timer}>Time: {timeLeft} seconds</h3>
        <h2 className={styles.questionText}>{question.question}</h2>
        {question?.image && <img src={question.image} className={styles.questionImage} />}
        {question.type === "single" && (
          <div className={styles.optionsContainer}>
            {question.options?.map((option) => (
              <label key={option} className={styles.option}>
                <input
                  className={styles.radioButton}
                  type="radio"
                  name={String(question.id)}
                  value={option}
                  onChange={handleAnswerChange}
                />
                {option}
              </label>
            ))}
          </div>
        )}
        {question.type === "multiple-choice" && (
          <div className={styles.optionsContainer}>
            {question.options?.map((option) => (
              <label key={option} className={styles.option}>
                <input
                  className={styles.checkBox}
                  type="checkbox"
                  value={option}
                  onChange={handleAnswerChange}
                />
                {option}
              </label>
            ))}
          </div>
        )}
        {question.type === "text" && (
          <input
            type="text"
            className={styles.textInput}
            onChange={handleAnswerChange}
          />
        )}
        <button className={styles.nextButton} onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default QuizPage;
