import { FC } from "react";
import styles from "./QuestionItem.module.scss";
import { QuestionType } from "../../../models/QuestionType";
import AnswerItem from "../AnswerItem/AnswerItem";

interface Props {
    question: QuestionType;
    onTextChange: (text: string) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    onAddAnswer: () => void;
    onUpdateAnswer: (answerId: number, newText: string) => void;
    onToggleCorrectAnswer: (answerId: number) => void;
    onRemoveAnswer: (answerId: number) => void;
}

const QuestionItem: FC<Props> = ({
    question,
    onTextChange,
    onImageUpload,
    onRemove,
    onAddAnswer,
    onUpdateAnswer,
    onToggleCorrectAnswer,
    onRemoveAnswer
}) => {
    return (
        <div className={styles.questionBlock}>
            <div className={styles.questionHeader}>
                <input
                    type="text"
                    value={question.text}
                    onChange={(e) => onTextChange(e.target.value)}
                    placeholder="Enter a question..."
                />
                <button className={styles.deleteQuestion} onClick={onRemove}>🗑️ Delete</button>
            </div>

            <label className={styles.imageUpload}>
                📷 Load image
                <input type="file" accept="image/*" onChange={onImageUpload} />
            </label>

            {question.image && <img src={question.image} className={styles.imagePreview} />}

            <div className={styles.answers}>
                {question.answers.map((answer) => (
                    <AnswerItem
                        key={answer.id}
                        answer={answer}
                        isOpenEnded={question.isOpenEnded}
                        onTextChange={(text) => onUpdateAnswer(answer.id, text)}
                        onToggleCorrect={() => onToggleCorrectAnswer(answer.id)}
                        onRemove={() => onRemoveAnswer(answer.id)}
                    />
                ))}
                {!question.isOpenEnded && (
                    <button className={styles.button} onClick={onAddAnswer}>+ Answer</button>
                )}
            </div>
        </div>
    );
};

export default QuestionItem;
