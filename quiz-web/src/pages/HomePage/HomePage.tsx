import { FC, useEffect, useState } from "react";
import { Quiz } from "../../models/Quiz";
import { Creator } from "../../models/Creator";
import { ApiWrapper } from "../../api/utils/ApiWrapper";
import { UserService } from "../../api/UserService";
import { QuizService } from "../../api/QuizService";
import styles from "./HomePage.module.scss"
import Wrapper from "../../components/wrapper/Wrapper";
import { RecentQuiz } from "../../components/card/card/RecentQuizCard";
import QuizCard from "../../components/card/card/QuizCard";
import AuthorCard from "../../components/card/author/AuthorCard";

const HomePage: FC = () => {
    // TODO: change all models to DTO, if it isn't their info page
    const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);
    const [topQuizzes, setTopQuizzes] = useState<Quiz[]>([]);
    const [topAuthors, setTopAuthors] = useState<Creator[]>([]);
    
    useEffect(() => {
        ApiWrapper.call(
            // TODO: set User to context
            UserService.getUser,
            (result: any) => { setRecentQuizzes(result.participatedQuizzes.slice(0, 2)) },
            [])
        ApiWrapper.call(
            QuizService.getTopQuizzes,
            (result: any) => { setTopQuizzes(result) },
            [])
        ApiWrapper.call(
            QuizService.getTopAuthors,
            (result: any) => { setTopAuthors(result) },
            [])
    }, [])

    return (
        <Wrapper enabledSearch={true}>
            <section className={styles.section_container}>
                <div className={styles.recent_container}>
                    <h2>Recent</h2>
                    <div className={styles.items_list}>
                        {recentQuizzes.map((quiz) =>
                            <RecentQuiz quiz={quiz} />
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
                            quizId={quiz.id}
                        />
                    )}
                </div>
            </section>

            <section className={styles.section_container}>
                <h2>The best author rating</h2>
                <div className={styles.items_list}>
                    {topAuthors.map((author) =>
                        <AuthorCard author={author} />
                    )}
                </div>
            </section>
        </Wrapper>
    )
}

export default HomePage