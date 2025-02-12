import { FC, useContext, useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import QuizCard from "../../components/card/QuizCard";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import { Quiz } from "../../models/Quiz";
import { Creator } from "../../models/Creator";
import Avatar from "../../components/avatar/Avatar";
import { AuthContext, AuthState } from "../../context/context";
import { AuthService } from "../../api/AuthService";
import { toast } from "react-toastify";
import { UserService } from "../../api/UserService";
import { QuizService } from "../../api/QuizService";

const HomePage: FC = () => {
    function getCookie(key: string) {
        var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
        return b ? b.pop() : "";
    }

    const { isAuth, setIsAuth } = useContext<AuthState>(AuthContext);

    const navigate = useNavigate();
    const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);
    const [topQuizzes, setTopQuizzes] = useState<Quiz[]>([]);
    const [topAuthors, setTopAuthors] = useState<Creator[]>([]);

    useEffect(() => {
        const getRecentQuizzes = async () => {
            await UserService.getUser().then((result) => {
                console.log(result)
                setRecentQuizzes(result.participatedQuizzes.slice(0, 2))
            })
        }
        const getTopQuizzes = async () => {
            await QuizService.getTopQuizzes().then((result) => {
                console.log(result)
                setTopQuizzes(result)
            })
        }
        const getTopAuthors = async () => {
            await QuizService.getTopAuthors().then((result) => {
                console.log(result)
                setTopAuthors(result)
            })
        }
        if (
            getCookie('refreshToken') != null &&
            localStorage.getItem("accessToken") == null && isAuth
        ) {
            const refreshToken = async () => {
                await AuthService.refreshToken()
                    .then((result) => {
                        if (result.hasOwnProperty("statusCode")) {
                            if (Array.isArray(result.message)) {
                                toast.error(result.message[0], { position: "top-right" });
                            }
                            else {
                                toast.error(result.message, { position: "top-right" });
                            }
                        }
                        else {
                            setIsAuth(true)
                            localStorage.setItem("accessToken", result.accessToken)
                        }
                    })
            }
            refreshToken().then(() => {
                if (isAuth) {
                    getRecentQuizzes()
                    getTopQuizzes()
                    getTopAuthors()
                }
            })
        } else {
            getRecentQuizzes()
            getTopQuizzes()
            getTopAuthors()
        }
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
                                        {quiz.numberOfTasks} questions • {quiz.creator.username}
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
                            quizId={quiz.id}
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
                                        <span> {author.createdQuizzes.length} tests </span>
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