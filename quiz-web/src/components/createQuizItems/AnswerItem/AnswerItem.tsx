import { FC } from "react";
import styles from "./AnswerItem.module.scss";
import { AnswerType } from "../../../models/AnswerType";

interface Props {
    answer: AnswerType;
    isOpenEnded: boolean;
    onTextChange: (text: string) => void;
    onToggleCorrect: () => void;
    onRemove: () => void;
}

const AnswerItem: FC<Props> = ({ answer, isOpenEnded, onTextChange, onToggleCorrect, onRemove }) => {
    return (
        <div className={styles.answerItem}>
            <input
                type="text"
                value={answer.text}
                className={styles.answerInput}
                onChange={(e) => onTextChange(e.target.value)}
                placeholder="Answer..."
            />
            {!isOpenEnded && (
                <input type="checkbox" checked={answer.isCorrect} onChange={onToggleCorrect} />
            )}
            <button className={styles.deleteAnswer} onClick={onRemove}>❌</button>
        </div>
    );
};

export default AnswerItem;
