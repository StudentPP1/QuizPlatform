import { FC, useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import QuizCard from "../../components/card/QuizCard";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import { Quiz } from "../../models/Quiz";
import { testCreator, testQuiz } from "../../test";
import { Creator } from "../../models/Creator";
import Avatar from "../../components/avatar/Avatar";

const HomePage: FC = () => {
    const navigate = useNavigate();
    const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);
    const [topQuizzes, setTopQuizzes] = useState<Quiz[]>([]);
    const [topAuthors, setTopAuthors] = useState<Creator[]>([]);

    useEffect(() => {
        // TODO: get 2 last quiz from history, top Quizzes, top Authors
        setRecentQuizzes([testQuiz, testQuiz])
        setTopQuizzes([testQuiz, testQuiz])
        setTopAuthors([testCreator, testCreator])
    }, [])

    return (
        <Wrapper enabledFooter={false} enabledSearch={true}>
            <section className={styles.section_container}>
                <div className={styles.recent_container}>
                    <h2>Recent</h2>
                    <div className={styles.items_list}>
                        {recentQuizzes.map((quiz) =>
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
                                        {quiz.tasks.length} questions • {quiz.creator.username}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.section_container}>
                <h2>The best quest rating</h2>
                <div className={styles.items_list}>
                    {topQuizzes.map((quiz) =>
                        <QuizCard
                            title={quiz.title}
                            count={quiz.tasks.length}
                            avatarUrl={quiz.creator.avatarUrl}
                            username={quiz.creator.username}
                        />
                    )}
                </div>
            </section>

            <section className={styles.section_container}>
                <h2>The best author rating</h2>
                <div className={styles.items_list}>
                    {topAuthors.map((author) =>
                        <div
                            key={author.userId}
                            onClick={() => {
                                localStorage.setItem("index", "0");
                                navigate(`/authorInfo/${author.userId}`);
                            }}
                            className={styles.author_card}>
                            <div className={styles.author_content}>
                                <div className={styles.author_info}>
                                    <div className={styles.author}>
                                        <Avatar avatarUrl={author.avatarUrl} />
                                        <span className={styles.name}>{author.username}</span>
                                    </div>

                                    <div className={styles.author_stats}>
                                        <span> {author.quizzes.length} tests </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </section>
        </Wrapper>
    )
}

export default HomePage