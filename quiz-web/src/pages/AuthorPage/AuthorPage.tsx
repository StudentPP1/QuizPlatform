import React, { useEffect, useState } from "react";
import styles from "./AuthorPage.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import { Creator } from "../../models/Creator";
import Avatar from "../../components/avatar/Avatar";
import { UserService } from "../../api/services/UserService";

const AuthorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [author, setAuthor] = useState<Creator>();
    const navigate = useNavigate();

    useEffect(() => {
        if (id != null) {
            UserService.getAuthor(id).then((result) => { setAuthor(result) })
        }
    }, [])

    return (
        <Wrapper>
            <div className={styles.authorContainer}>
                <div className={styles.profile}>
                    <Avatar avatarUrl={author?.avatarUrl} />
                    <div className={styles.info}>
                        <h2 className={styles.nickname}>{author?.username}</h2>
                        <p className={styles.rating}>
                            {author != null ? "⭐".repeat(author.rating) : <></>}
                        </p>
                    </div>
                </div>
                <h3 className={styles.sectionTitle}>Quests</h3>
                <div className={styles.quests}>
                    {author?.createdQuizzes.map((quiz) => (
                        <div
                            onClick={() => navigate(`/quizInfo/${quiz.id}`)}
                            key={quiz.id} className={styles.quest}>
                            <h4 className={styles.questTitle}>{quiz.title}</h4>
                            <p className={styles.questInfo}>{quiz.numberOfTasks} questions</p>
                            <p className={styles.questInfo}>{"⭐".repeat(quiz.rating)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Wrapper>
    );
};

export default AuthorPage;