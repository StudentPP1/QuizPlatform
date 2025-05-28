import { useState, useCallback } from "react";
import { QuestionType } from "../models/QuestionType";

type QuizFormState = {
  title: string;
  description: string;
  timeLimit: string;
  questions: QuestionType[];
};

// The actions (functions) available:
type QuizFormActions = {
  updateField: <K extends keyof QuizFormState>(
    field: K,
    value: QuizFormState[K]
  ) => void;
  addQuestion: (isOpenEnded: boolean) => void;
  updateQuestion: (id: number, updatedQuestion: QuestionType) => void;
  deleteQuestion: (id: number) => void;
  validate: () => string | null;
  prepareFormData: () => FormData;
};

export const useQuizForm = (
  initialQuiz?: any
): [QuizFormState, QuizFormActions] => {
  const [formState, setFormState] = useState<QuizFormState>({
    title: initialQuiz?.title || "",
    description: initialQuiz?.description || "",
    timeLimit: initialQuiz?.timeLimit.toString() || "",
    questions: initialQuiz?.questions || [],
  });

  // generic function to update any field in the form state: 
  // example: updateField("title" (key of QuizFormState), "new title" (string value))
  const updateField = useCallback(
    <K extends keyof QuizFormState>(field: K, value: QuizFormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // useCallback is used to avoid recreating functions on every render
  // if dependencies change, the function will be recreated
  const addQuestion = useCallback(
    (isOpenEnded: boolean) => {
      const newQuestion: QuestionType = {
        id: Date.now(),
        text: "",
        answers: isOpenEnded
          ? [{ id: Date.now(), text: "", isCorrect: true }]
          : [
              { id: Date.now(), text: "", isCorrect: false },
              { id: Date.now() + 1, text: "", isCorrect: false },
            ],
        image: null,
        isOpenEnded,
      };

      updateField("questions", [...formState.questions, newQuestion]);
    },
    [formState.questions, updateField]
  );

  const updateQuestion = useCallback(
    (id: number, updatedQuestion: QuestionType) => {
      const updatedQuestions = formState.questions.map((q) =>
        q.id === id ? updatedQuestion : q
      );
      updateField("questions", updatedQuestions);
    },
    [formState.questions, updateField]
  );

  const deleteQuestion = useCallback(
    (id: number) => {
      const filteredQuestions = formState.questions.filter((q) => q.id !== id);
      updateField("questions", filteredQuestions);
    },
    [formState.questions, updateField]
  );

  const validate = useCallback((): string | null => {
    const { questions, timeLimit } = formState;

    if (!/^\d+$/.test(timeLimit)) return "Invalid time format!";
    const time = parseInt(timeLimit);
    if (time < 1 || time > 120)
      return "Time must be between 1 and 120 minutes!";

    for (const question of questions) {
      if (!question.text.trim()) return "Fill in all the fields!";
      if (!question.isOpenEnded) {
        if (question.answers.some((a) => !a.text.trim()))
          return "Fill in all answer fields!";
        if (!question.answers.some((a) => a.isCorrect))
          return "Each question needs at least one correct answer!";
      }
    }
    return null;
  }, [formState]);

  const prepareFormData = useCallback((): FormData => {
    const formData = new FormData();
    const { title, description, timeLimit, questions } = formState;

    const tasks = questions.map((question) => {
      const type = question.isOpenEnded
        ? "text"
        : question.answers.filter((a) => a.isCorrect).length === 1 ? "single" : "multiple";

      return {
        question: question.text,
        type,
        image: question.image?.name || null,
        correctAnswers: question.answers
          .filter((a) => a.isCorrect)
          .map((a) => a.text),
        options: question.answers.map((a) => a.text),
      };
    });

    questions.forEach((question, index) => {
      if (question.image) {
        formData.append(`images[${index}]`, question.image);
      }
    });

    const quizData = {
      ...(initialQuiz?.id && { id: initialQuiz.id }),
      title,
      description,
      timeLimit: parseInt(timeLimit, 10),
      tasks,
    };

    formData.append("quiz", JSON.stringify(quizData));
    return formData;
  }, [formState, initialQuiz]);

  // Return actual state and actions 
  return [
    formState,
    {
      updateField,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      validate,
      prepareFormData,
    },
  ];
};
