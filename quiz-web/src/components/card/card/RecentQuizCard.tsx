import { useNavigate } from "react-router-dom";
import styles from "./RecentQuizCard.module.scss"
import { FC } from "react";
import { QuizDTO } from "../../../models/quiz/QuizDTO";

export const RecentQuiz: FC<{quiz: QuizDTO}> = ({quiz}) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => {
                localStorage.setItem("index", "0")
                navigate(`/quizInfo/${quiz.id}`)
            }}
            className={styles.recent_item}>
            <div className={styles.recent_icon}>📘</div>
            <div className={styles.recent_details}>
                <h4 className={styles.recent_quizTitle}>{quiz.title}</h4>
                <p className={styles.recent_meta}>
                    {quiz.numberOfTasks} questions
                </p>
            </div>
        </div>
    )
}