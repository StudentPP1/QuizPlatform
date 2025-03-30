import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./QuizPage.module.scss";
import { UserAnswers } from "../../../models/UserAnswers";
import { QuizNavigate } from "../../../models/QuizNavigate";
import { QuizResultState } from "../../../models/QuizResultState";
import useTimer from "../../../hooks/useTimer";
import { QuizTask } from "../../../models/QuizTask";

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quiz } = location.state as QuizNavigate;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const timeLeft = useTimer(quiz.timeLimit * 60, quiz.id);
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

  const handleAnswerSelection = (question: QuizTask, value: string, checked?: boolean) => {
    setAnswers((prev) => {
      if (question.type === "multiple-choice") {
        const selected = (prev[question.id] as string[]) || [];
        return {
          ...prev,
          [question.id]: checked ? [...selected, value] : selected.filter((item) => item !== value),
        };
      }
      return { ...prev, [question.id]: [value] };
    });
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleAnswerSelection(question, event.target.value, event.target.checked);
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