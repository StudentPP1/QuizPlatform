import { FC } from "react";
import styles from "./quizCard.module.scss";
import { useNavigate } from "react-router-dom";
import Avatar from "../avatar/Avatar";

const QuizCard: FC<{ title: string, count: number, avatarUrl: string, username: string }> =
  ({ title, count, avatarUrl, username }) => {
    const navigate = useNavigate();
    
    return (
      <div className={styles.card} onClick={() => navigate("/quizInfo/1")}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.terms}>{count} questions</span>
        <div className={styles.footer}>
          <div className={styles.author}>
            <Avatar avatarUrl={avatarUrl} />
            <span className={styles.name}>{username}</span>
          </div>
        </div>
      </div>
    );
  };

export default QuizCard;
