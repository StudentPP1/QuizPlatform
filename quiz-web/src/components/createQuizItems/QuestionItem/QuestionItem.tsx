import { FC, useState } from "react";
import styles from "./QuestionItem.module.scss";
import { QuestionType } from "../../../models/QuestionType";
import AnswerItem from "../AnswerItem/AnswerItem";
import { AnswerType } from "../../../models/AnswerType";

interface Props {
    question: QuestionType;
    removeQuestion: (id: number) => void;
    saveQuestion: (id: number, text: string, image: string | null, answers: AnswerType[]) => void;
}

const QuestionItem: FC<Props> = ({
    question,
    removeQuestion,
    saveQuestion
}) => {
    const [questionText, setQuestionText] = useState(question.text);
    const [questionImage, setQuestionImage] = useState(question.image);
    const [answers, setAnswers] = useState(question.answers);

    return (
        <div className={styles.questionBlock}>
            <div className={styles.questionHeader}>
                <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter a question..."
                />
                <button
                    className={styles.deleteQuestion}
                    onClick={() => { removeQuestion(question.id) }}
                >🗑️ Delete</button>
            </div>

            <label className={styles.imageUpload}>
                📷 Load image
                <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => { setQuestionImage(URL.createObjectURL(event.target.files![0])) }} />
            </label>

            {questionImage && <img src={questionImage} className={styles.imagePreview} />}

            <div className={styles.answers}>
                {answers.map((answer) => (
                    <AnswerItem
                        key={answer.id}
                        answer={answer}
                        isOpenEnded={question.isOpenEnded}
                        onTextChange={(id: number, text: string) => setAnswers(answers.map((a) => (a.id === id ? { ...a, text: text } : a)))}
                        onToggleCorrect={(id: number) => setAnswers(answers.map((a) => (a.id === id ? { ...a, isCorrect: !a.isCorrect } : a)))}
                        onRemove={(id: number) => setAnswers(answers.filter((a) => a.id !== id))}
                    />
                ))}
                {!question.isOpenEnded && (
                    <button className={styles.button} onClick={() => {
                        setAnswers([...question.answers, { id: Date.now(), text: "", isCorrect: false }])
                    }}>+ Answer</button>
                )}
            </div>

            <button
                className={styles.button}
                onClick={() => { saveQuestion(question.id, questionText, questionImage, answers) }}
            >Save</button>
        </div>
    );
};

export default QuestionItem;
