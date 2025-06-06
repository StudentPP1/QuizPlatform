import { FC, useState } from "react";
import styles from "../CreateQuizPage.module.scss";
import AnswerItem from "./AnswerItem";
import { AnswerType } from "../../../models/enums/AnswerType";
import { QuestionType } from "../../../models/enums/QuestionType";

const QuizItem: FC<{
    question: QuestionType,
    onQuestionChange: (updatedQuestion: QuestionType) => void,
    onDelete: () => void
}> = ({ question, onQuestionChange, onDelete }) => {

    const [imagePreview, setImagePreview] = useState<string | null>(
        question.image ? question.image : null
    );

    const handleTextChange = (newText: string) => {
        onQuestionChange({ ...question, text: newText });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const newImagePreview = URL.createObjectURL(file);
        setImagePreview(newImagePreview);
        onQuestionChange({ ...question, image: file });
    };

    const handleImageRemove = () => {
        setImagePreview(null);
        onQuestionChange({ ...question, image: null });
    };

    const addAnswer = () => {
        const newAnswer = {
            id: Date.now(),
            text: "",
            isCorrect: question.isOpenEnded ? true : false,
        };
        onQuestionChange({
            ...question,
            answers: [...question.answers, newAnswer],
        });
    };

    const updateAnswer = (answerId: number, newData: Partial<AnswerType>) => {
        const updatedAnswers = question.answers.map((answer) =>
            answer.id === answerId ? { ...answer, ...newData } : answer
        );
        onQuestionChange({ ...question, answers: updatedAnswers });
    };

    const removeAnswer = (answerId: number) => {
        const updatedAnswers = question.answers.filter(a => a.id !== answerId);
        onQuestionChange({ ...question, answers: updatedAnswers });
    };

    return (
        <div className={styles.questionBlock}>
            <div className={styles.questionHeader}>
                <input
                    type="text"
                    value={question.text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="Enter a question..."
                />
                <button
                    type="button"
                    className={styles.deleteQuestion}
                    onClick={onDelete}
                    aria-label="Delete question">
                    🗑️ Delete
                </button>
            </div>

            <label className={styles.imageUpload}>
                📷 Load image
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload} />
            </label>

            {imagePreview != null
                ? <img src={imagePreview} className={styles.imagePreview} />
                : <></>}
            {imagePreview != null
                ? <button
                    className={styles.deleteImage}
                    onClick={handleImageRemove}>
                    🗑️ Delete
                </button>
                : <></>}

            <div className={styles.answers}>
                {question.answers.map((answer) => (
                    <AnswerItem
                        key={answer.id}
                        answer={answer}
                        isOpenEnded={question.isOpenEnded}
                        onAnswerChange={(newData) => updateAnswer(answer.id, newData)}
                        onRemove={() => removeAnswer(answer.id)}
                        canDelete={!question.isOpenEnded && question.answers.length > 2}
                    />
                ))}

                {!question.isOpenEnded && (
                    <div className={styles.button_wrapper}>
                        <button
                            type="button"
                            className={styles.button}
                            onClick={addAnswer}>
                            Add Answer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizItem;