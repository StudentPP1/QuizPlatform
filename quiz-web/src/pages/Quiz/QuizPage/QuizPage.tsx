import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./QuizPage.module.scss";

export type QuestionType = {
  id: number;
  type: "single" | "multiple" | "text";
  question: string;
  options?: string[];
  correct: string | string[];
  image?: string;
}

export type AnswersType = {
  [key: number]: string | string[];
};

const quizQuestions: QuestionType[] = [
  {
    id: 1,
    type: "single",
    question: "Який колір сонця?",
    options: ["Червоний", "Синій", "Жовтий", "Зелений"],
    correct: "Жовтий",
    image: "https://images.prom.ua/1734007967_w600_h600_1734007967.jpg",
  },
  {
    id: 2,
    type: "multiple",
    question: "Які міста є столицями країн?",
    options: ["Київ", "Лондон", "Одеса", "Берлін"],
    correct: ["Київ", "Лондон", "Берлін"],
  },
  {
    id: 3,
    type: "text",
    question: "Столиця України?",
    correct: "Київ",
  },
];

const QuizPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswersType>({});
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.warn("You didn't have time to complete the quest!");
          navigate("/quizInfo/1");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const question = quizQuestions[currentQuestionIndex];

  const handleNext = (): void => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const quiz = {title: "quizTitle", questions: quizQuestions}
      navigate("/results", { state: { answers, quiz } });
    }
  };

  const handleExit = (): void => {
    navigate("/home");
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = event.target;
    if (question.type === "multiple") {
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
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
    }
  };

  return (
    <div className={styles.quizContainer}>
      <button className={styles.exitButton} onClick={handleExit}>
        <FaTimes />
      </button>
      <div className={styles.quizCard}>
        <h3 className={styles.questionNumber}>
          Question {currentQuestionIndex + 1} / {quizQuestions.length}
        </h3>
        <h3 className={styles.timer}>Time: {timeLeft} seconds</h3>
        <h2 className={styles.questionText}>{question.question}</h2>
        {question.image && <img src={question.image} className={styles.questionImage} />}
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
        {question.type === "multiple" && (
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
