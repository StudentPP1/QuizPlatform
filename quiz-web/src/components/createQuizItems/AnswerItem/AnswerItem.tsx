import { FC } from "react";
import styles from "./AnswerItem.module.scss";
import { AnswerType } from "../../../models/AnswerType";

interface Props {
    answer: AnswerType;
    isOpenEnded: boolean;
    onTextChange: (id: number, text: string) => void;
    onToggleCorrect: (id: number) => void;
    onRemove: (id: number) => void;
}

const AnswerItem: FC<Props> = ({ answer, isOpenEnded, onTextChange, onToggleCorrect, onRemove }) => {
    return (
        <div className={styles.answerItem}>
            <input
                type="text"
                value={answer.text}
                className={styles.answerInput}
                onChange={(e) => onTextChange(answer.id, e.target.value)}
                placeholder="Answer..."
            />
            {!isOpenEnded && (
                <input type="checkbox" checked={answer.isCorrect} onChange={() => {
                    onToggleCorrect(answer.id);
                }} />
            )}
            <button className={styles.deleteAnswer} onChange={() => {
                onRemove(answer.id);
            }}>❌</button>
        </div>
    );
};

export default AnswerItem;
