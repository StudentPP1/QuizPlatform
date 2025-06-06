import { FC } from "react";
import styles from "../CreateQuizPage.module.scss";
import { AnswerType } from "../../../models/enums/AnswerType";

const AnswerItem: FC<{
    answer: AnswerType;
    isOpenEnded: boolean;
    onAnswerChange: (updatedData: Partial<AnswerType>) => void;
    onRemove: () => void;
    canDelete: boolean;
}> = ({ answer, isOpenEnded, onAnswerChange, onRemove, canDelete }) => {

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onAnswerChange({ text: e.target.value });
    };

    const handleToggleCorrect = () => {
        onAnswerChange({ isCorrect: !answer.isCorrect });
    };

    return (
        <div className={styles.answerItem}>
            <input
                type="text"
                value={answer.text}
                onChange={handleTextChange}
                placeholder="Enter answer..."
                className={styles.answerInput}
            />

            {!isOpenEnded && (
                <input
                    type="checkbox"
                    checked={answer.isCorrect}
                    onChange={handleToggleCorrect}
                />
            )}

            {canDelete && (
                <button
                    type="button"
                    className={styles.deleteAnswer}
                    onClick={onRemove}>
                    ✕
                </button>
            )}
        </div>
    );
};

export default AnswerItem;