import React, { useEffect, useRef, useState } from "react";
import styles from "./AuthorPage.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import { Creator } from "../../models/Creator";
import Avatar from "../../components/avatar/Avatar";
import { UserService } from "../../api/services/UserService";
import { CreatedQuizzesStrategy } from "../../api/services/QuizFetchStrategy";
import { useObserver } from "../../hooks/useObserver";
import { QuizDTO } from "../../models/QuizDTO";

const AuthorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [author, setAuthor] = useState<Creator>();
    const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);
    const navigate = useNavigate();
    const SIZE = 10;
    const [isLoading, setLoading] = useState(false);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(SIZE);
    const strategy = new CreatedQuizzesStrategy();
    const lastElement = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (id != null) {
            UserService.getAuthor(id).then((result) => { setAuthor(result) })
        }
    }, [])

    useObserver(lastElement, isLoading, () => {
        setLoading(true);
        if (id == null) return;
        strategy.fetchQuizzes(id, from, to).then((data) => {
            setQuizzes(prev => {
                if (prev) {
                    return [...prev, ...data];
                } else {
                    return data;
                }
            });
            setFrom(prev => prev + SIZE);
            setTo(prev => prev + SIZE);
        }).finally(() => setLoading(false));
    });

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
                    {quizzes.map((quiz) => (
                        <div
                            onClick={() => navigate(`/quizInfo/${quiz.id}`)}
                            key={quiz.id} className={styles.quest}>
                            <h4 className={styles.questTitle}>{quiz.title}</h4>
                            <p className={styles.questInfo}>{quiz.numberOfTasks} questions</p>
                            <p className={styles.questInfo}>{"⭐".repeat(quiz.rating)}</p>
                        </div>
                    ))}
                    <div ref={lastElement} className="last" />
                </div>
            </div>
        </Wrapper>
    );
};

export default AuthorPage;