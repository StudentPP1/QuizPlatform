import { FC, useEffect, useState } from "react";
import styles from "./HomePage.module.scss"
import Wrapper from "../../components/wrapper/Wrapper";
import { RecentQuiz } from "../../components/card/card/RecentQuizCard";
import QuizCard from "../../components/card/card/QuizCard";
import AuthorCard from "../../components/card/author/AuthorCard";
import { QuizDTO } from "../../models/QuizDTO";
import { CreatorDTO } from "../../models/CreatorDTO";
import { QuizService } from "../../api/services/QuizService";
import { useCachedFetch } from "../../hooks/useCachedFetch";
import Loading from "../../components/loading/Loader";

const HomePage: FC = () => {
    const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // TODO: Task 3 => implement (save setTopQuizzes, setTopAuthors to map & create Timer to update them)
    const { data: topQuizzes, loading: loadingQuizzes } = useCachedFetch<QuizDTO[]>(
        "topQuizzes",
        () => QuizService.getTopQuizzes(),
        // { ttl: 30000 }
    );

    const { data: topAuthors, loading: loadingAuthors } = useCachedFetch<CreatorDTO[]>(
        "topAuthors",
        () => QuizService.getTopAuthors(),
        // { ttl: 30000 }
    );

    useEffect(() => {
        QuizService.getParticipatedQuizzes(0, 2).then((data) => {
            setQuizzes(data);
            setIsLoading(false);
        })
    }, []);

    return (
        <Wrapper>
            <section className={styles.section_container}>
                <div className={styles.recent_container}>
                    <h2>Recent</h2>
                    <div className={styles.items_list}>
                        {isLoading ? <Loading /> : quizzes?.map((quiz) =>
                            <RecentQuiz key={quiz.id} quiz={quiz} />
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.section_container}>
                <h2>The best quest rating</h2>
                <div className={styles.items_list}>
                    {loadingQuizzes ? <Loading /> : topQuizzes?.map((quiz) =>
                        <QuizCard
                            key={quiz.id}
                            title={quiz.title}
                            count={quiz.numberOfTasks}
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
                    {loadingAuthors ? <Loading /> : topAuthors?.map((author) =>
                        <AuthorCard key={author.userId} author={author} />
                    )}
                </div>
            </section>
        </Wrapper>
    );
}

export default HomePage;