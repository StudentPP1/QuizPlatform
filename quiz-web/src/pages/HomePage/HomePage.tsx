import { FC, useContext, useEffect, useState } from "react";
import styles from "./HomePage.module.scss"
import Wrapper from "../../components/wrapper/Wrapper";
import { RecentQuiz } from "../../components/card/card/RecentQuizCard";
import QuizCard from "../../components/card/card/QuizCard";
import AuthorCard from "../../components/card/author/AuthorCard";
import { QuizDTO } from "../../models/QuizDTO";
import { CreatorDTO } from "../../models/CreatorDTO";
import { AuthContext } from "../../context/context";
import { QuizService } from "../../api/services/QuizService";

const HomePage: FC = () => {
    const { user } = useContext(AuthContext);
    const [topQuizzes, setTopQuizzes] = useState<QuizDTO[]>([]);
    const [topAuthors, setTopAuthors] = useState<CreatorDTO[]>([]);

    // TODO: Task 3 implement (save setTopQuizzes, setTopAuthors to map & create Timer to update them)
    
    useEffect(() => {
        setTopQuizzes([])
        setTopAuthors([])
        // QuizService.getTopQuizzes().then((result: any) => { setTopQuizzes(result) })
        // QuizService.getTopAuthors().then((result: any) => { setTopAuthors(result) })
    }, [])

    return (
        <Wrapper>
            <section className={styles.section_container}>
                <div className={styles.recent_container}>
                    <h2>Recent</h2>
                    <div className={styles.items_list}>
                        {user?.participatedQuizzes.splice(0, 2).map((quiz) =>
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
                    {topAuthors.map((author) =>
                        <AuthorCard author={author} />
                    )}
                </div>
            </section>
        </Wrapper>
    )
}

export default HomePage