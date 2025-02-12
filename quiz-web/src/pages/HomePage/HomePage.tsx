import { FC } from "react";
import styles from "./HomePage.module.scss";
import QuizCard from "../../components/card/QuizCard";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";

const HomePage: FC = () => {
    const navigate = useNavigate();

    return (
        <Wrapper enabledFooter={true} enabledSearch={true}>
            <section className={styles.section_container}>
                <div className={styles.recent_container}>
                    <h2>Recent</h2>
                    <div className={styles.items_list}>
                        <div
                            onClick={() => {
                                localStorage.setItem("index", "0")
                                navigate("/quizInfo/1")
                            }}
                            className={styles.recent_item}>
                            <div className={styles.recent_icon}>📘</div>
                            <div className={styles.recent_details}>
                                <h4 className={styles.recent_quizTitle}>Completed test</h4>
                                <p className={styles.recent_meta}>
                                    9 questions • Author
                                </p>
                            </div>
                        </div>
                        <div
                            onClick={() => {
                                localStorage.setItem("index", "0")
                                navigate("/quizInfo/1")
                            }}
                            className={styles.recent_item}>
                            <div className={styles.recent_icon}>📘</div>
                            <div className={styles.recent_details}>
                                <h4 className={styles.recent_quizTitle}>Completed test</h4>
                                <p className={styles.recent_meta}>
                                    9 questions • Author
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.section_container}>
                <h2>The best quest rating</h2>
                <div className={styles.items_list}>
                    <QuizCard title="test" count={4} author="author" />
                    <QuizCard title="test" count={4} author="author" />
                    <QuizCard title="test" count={4} author="author" />
                </div>
            </section>

            <section className={styles.section_container}>
                <h2>The best author rating</h2>
                <div className={styles.items_list}>
                    <div
                        onClick={() => {
                            localStorage.setItem("index", "0");
                            navigate("/authorInfo/1");
                        }}
                        className={styles.author_card}>
                        <div className={styles.author_content}>
                            <img src="https://i.pravatar.cc/40" className={styles.author_avatar} />
                            <div className={styles.author_info}>
                                <h2>Author</h2>
                                <div className={styles.author_stats}>
                                    <span> 9 test </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            localStorage.setItem("index", "0");
                            navigate("/authorInfo/1");
                        }}
                        className={styles.author_card}>
                        <div className={styles.author_content}>
                            <img src="https://i.pravatar.cc/40" className={styles.author_avatar} />
                            <div className={styles.author_info}>
                                <h2>Author</h2>
                                <div className={styles.author_stats}>
                                    <span> 9 test </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            localStorage.setItem("index", "0");
                            navigate("/authorInfo/1");
                        }}
                        className={styles.author_card}>
                        <div className={styles.author_content}>
                            <img src="https://i.pravatar.cc/40" className={styles.author_avatar} />
                            <div className={styles.author_info}>
                                <h2>Author</h2>
                                <div className={styles.author_stats}>
                                    <span> 9 test </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Wrapper>
    )
}

export default HomePage