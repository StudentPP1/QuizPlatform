import React from "react";
import styles from "./AuthorPage.module.scss";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";

interface Quest {
    id: number;
    title: string;
    questions: number;
    rating: number;
}

const quests: Quest[] = [
    { id: 1, title: "Квест 1", questions: 10, rating: 4.5 },
    { id: 2, title: "Квест 2", questions: 15, rating: 4.8 },
    { id: 3, title: "Квест 3", questions: 20, rating: 4.2 },
    { id: 4, title: "Квест 2", questions: 15, rating: 4.8 },
    { id: 5, title: "Квест 3", questions: 20, rating: 4.2 },
];

const AuthorPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Wrapper enabledFooter={true} enabledSearch={true}>
            <div className={styles.authorContainer}>
                <div className={styles.profile}>
                    <div className={styles.avatar}>🧑</div>
                    <div className={styles.info}>
                        <h2 className={styles.nickname}>Нік користувача</h2>
                        <p className={styles.rating}>
                            {"⭐".repeat(4)}
                        </p>
                    </div>
                </div>
                <h3 className={styles.sectionTitle}>Quests</h3>
                <div className={styles.quests}>
                    {quests.map((quest) => (
                        <div
                            onClick={() => navigate("/quizInfo/1")}
                            key={quest.id} className={styles.quest}>
                            <h4 className={styles.questTitle}>{quest.title}</h4>
                            <p className={styles.questInfo}>{quest.questions} questions</p>
                            <p className={styles.questInfo}>{"⭐".repeat(4)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Wrapper>
    );
};

export default AuthorPage;
