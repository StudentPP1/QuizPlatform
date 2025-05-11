import { FC } from "react"
import { AnswerType } from "../../models/AnswerType"
import { QuestionType } from "../../models/QuestionType"
import styles from "./CreateQuizPage.module.scss";

const AnswerItem: FC<{
    setQuestions: any,
    questions: QuestionType[]
    answer: AnswerType,
    question: QuestionType
}> = ({
    answer, question, setQuestions, questions
}) => {
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
        )
    }

export default AnswerItem;