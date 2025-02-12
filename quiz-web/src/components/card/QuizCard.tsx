import { FC } from "react";
import styles from "./quizCard.module.scss";
import { useNavigate } from "react-router-dom";

const QuizCard: FC<{ title: string, count: number, author: string }> =
  ({ title, count, author }) => {
    const navigate = useNavigate();
    
    return (
      <div className={styles.card} onClick={() => navigate("/quizInfo/1")}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.terms}>{count} questions</span>
        <div className={styles.footer}>
          <div className={styles.author}>
            <img src="https://i.pravatar.cc/40" className={styles.icon} />
            <span className={styles.name}>{author}</span>
          </div>
        </div>
      </div>
    );
  };

export default QuizCard;
