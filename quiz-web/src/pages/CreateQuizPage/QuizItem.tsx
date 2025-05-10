import { FC } from "react";
import styles from "./CreateQuizPage.module.scss";
import { QuestionType } from "../../models/QuestionType";

const QuizItem: FC<{ question: QuestionType, questions: QuestionType[], setQuestions: any }> = ({
    question,
    questions,
    setQuestions
}) => {
    const updateQuestionText = (id: number, newText: string) => {
        setQuestions(
            questions.map((q) => (q.id === id ? { ...q, text: newText } : q))
        );
    };

    const handleImageUpload = (id: number, event: any) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setQuestions(
                questions.map((q) =>
                    q.id === id ? { ...q, image: imageUrl } : q
                )
            );
        }
    };

    const addAnswer = (questionId: number) => {
        setQuestions(
            questions.map((q: QuestionType) =>
                q.id === questionId
                    ? {
                        ...q,
                        answers: [...q.answers, { id: Date.now(), text: "", isCorrect: false }]
                    }
                    : q
            )
        );
    };

    const updateAnswerText = (questionId: number, answerId: number, newText: string) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        answers: q.answers.map((a) =>
                            a.id === answerId ? { ...a, text: newText } : a
                        )
                    }
                    : q
            )
        );
    };

    const toggleCorrectAnswer = (questionId: number, answerId: number) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        answers: q.answers.map((a) =>
                            a.id === answerId ? { ...a, isCorrect: !a.isCorrect } : a
                        )
                    }
                    : q
            )
        );
    };

    const removeQuestion = (id: number) => {
        setQuestions(questions.filter((q) => q.id !== id));
    };

    const removeAnswer = (questionId: number, answerId: number) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? { ...q, answers: q.answers.filter((a) => a.id !== answerId) }
                    : q
            )
        );
    };

    return (
        <div key={question.id} className={styles.questionBlock}>
            <div className={styles.questionHeader}>
                <input
                    type="text"
                    value={question.text}
                    onChange={(e) => updateQuestionText(question.id, e.target.value)}
                    placeholder="Enter a question..."
                />
                <button
                    className={styles.deleteQuestion}
                    onClick={() => removeQuestion(question.id)}>
                    🗑️ Delete
                </button>
            </div>

            <label className={styles.imageUpload}>
                📷 Load image
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(question.id, e)} />
            </label>

            {question.image && <img src={question.image} className={styles.imagePreview} />}

            <div className={styles.answers}>
                {question.answers.map((answer) => (
                    <div key={answer.id} className={styles.answerItem}>
                        <input
                            type="text"
                            value={answer.text}
                            className={styles.answerInput}
                            onChange={(e) =>
                                updateAnswerText(question.id, answer.id, e.target.value)
                            }
                            placeholder="Answer..."
                        />
                        {!question.isOpenEnded &&
                            <input
                                type="checkbox"
                                checked={answer.isCorrect}
                                onChange={() => toggleCorrectAnswer(question.id, answer.id)}
                            />
                        }
                        {question.answers.indexOf(answer) > 1
                            ?
                            <button
                                className={styles.deleteAnswer}
                                onClick={() => removeAnswer(question.id, answer.id)}>
                                ❌
                            </button>
                            :
                            <></>
                        }
                    </div>
                ))}
                {!question.isOpenEnded &&
                    <div className={styles.button_wrapper}>
                        <div
                            className={styles.button}
                            onClick={() => addAnswer(question.id)}>
                            + answer
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default QuizItem;