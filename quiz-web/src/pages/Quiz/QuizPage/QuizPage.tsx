import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./QuizPage.module.scss";
import { UserAnswers } from "../../../models/UserAnswers";
import { QuizNavigate } from "../../../models/QuizNavigate";
import { QuizResultState } from "../../../models/QuizResultState";
import useTimer from "../../../hooks/useTimer";
import { QuizTask } from "../../../models/QuizTask";
import { API_BASE_URL } from "../../../constants/constants";

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

  const SingleChoiceStrategy = (question: QuizTask) => (
    <>
      {question.options?.map((option) => (
        <label key={option} className={styles.option}>
          <input
            className={styles.radioButton}
            type="radio"
            name={question.id}
            value={option}
            onChange={handleAnswerChange}
          />
          {option}
        </label>
      ))}
    </>
  );

  const MultipleChoiceStrategy = (question: QuizTask) => (
    <>
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
    </>
  );

  const TextStrategy = (question: QuizTask) => (
    <>
      {question.options?.map((option) => (
        <label key={option} className={styles.option_text}>
          <input
            autoFocus={true}
            type="text"
            className={styles.textInput}
            onChange={handleAnswerChange}
            value={(answers[question.id] && answers[question.id][0]) || ""}
          />
        </label>
      ))}
    </>
  );

  const strategies = new Map<string, (question: QuizTask) => any>([
    ['single', (question) => SingleChoiceStrategy(question)],
    ['multiple-choice', (question) => MultipleChoiceStrategy(question)],
    ['text', (question) => TextStrategy(question)],
  ]);

  // TODO: use strategy pattern
  const QuestionStrategy = (question: QuizTask) => {
    return strategies.get(question.type)?.(question);
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
        {question?.image && <img src={API_BASE_URL + question.image} className={styles.questionImage} />}
        <div className={styles.optionsContainer}>
          {QuestionStrategy(question)}
        </div>
        <button className={styles.nextButton} onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default QuizPage;