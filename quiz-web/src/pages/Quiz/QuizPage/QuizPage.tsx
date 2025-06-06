import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./QuizPage.module.scss";
import { UserAnswers } from "../../../models/user/UserAnswers";
import { QuizNavigate } from "../../../models/quiz/QuizNavigate";
import { QuizResultState } from "../../../models/quiz/QuizResultState";
import useTimer from "../../../hooks/useTimer";
import { QuizTask } from "../../../models/quiz/QuizTask";
import { QUESTION_TYPES } from "../../../constants/constants";

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
      if (question.type === QUESTION_TYPES.MULTIPLE) {
        const selected = (prev[currentQuestionIndex.toString()] as string[]) || [];
        return {
          ...prev,
          [currentQuestionIndex.toString()]: checked ? [...selected, value] : selected.filter((item) => item !== value),
        };
      }
      return { ...prev, [currentQuestionIndex.toString()]: [value] };
    });
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleAnswerSelection(question, event.target.value, event.target.checked);
  };

  const SingleChoiceStrategy = (question: QuizTask) => {
    return (
      <>
        {question.options?.map((option) => (
          <label key={option} className={styles.option}>
            <input
              className={styles.radioButton}
              type="radio"
              value={option}
              name={currentQuestionIndex.toString()}
              onChange={handleAnswerChange}
              checked={answers[currentQuestionIndex.toString()]?.[0] === option}
            />
            {option}
          </label>
        ))}
      </>
    )
  }

  const MultipleChoiceStrategy = (question: QuizTask) => {
    return (
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
    )
  }

  const TextStrategy = (question: QuizTask) => {
    const index = currentQuestionIndex.toString();
    return (
      <>
        {question.options?.map((option) => (
          <label key={option} className={styles.option_text}>
            <input
              autoFocus={true}
              type="text"
              className={styles.textInput}
              onChange={handleAnswerChange}
              value={(answers[index] && answers[index][0]) || ""}
            />
          </label>
        ))}
      </>
    )
  }

  const strategies = new Map<string, (question: QuizTask) => any>([
    [QUESTION_TYPES.SINGLE, (question) => SingleChoiceStrategy(question)],
    [QUESTION_TYPES.MULTIPLE, (question) => MultipleChoiceStrategy(question)],
    [QUESTION_TYPES.TEXT, (question) => TextStrategy(question)],
  ]);

  const QuestionStrategy = (question: QuizTask) => {
    console.log("Question", question);
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
        {question.image && <img src={question.image} className={styles.questionImage} />}
        <div className={styles.optionsContainer}>
          {QuestionStrategy(question)}
        </div>
        <button className={styles.nextButton} onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default QuizPage;