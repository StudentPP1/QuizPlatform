import { FaPlay } from "react-icons/fa";
import styles from "./QuizInfoPage.module.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";

const QuizInfoPage = () => {
    const navigate = useNavigate();

    const quiz = {
        title: "title",
        author: "author",
        rating: 5,
        reviews: 7,
        description: "description",
        latestReviews: [
            { user: "aboba", rating: 5, comment: "Дуже корисний тест!" },
            { user: "abiba", rating: 4, comment: "Цікавий матеріал." },
            { user: "aboba", rating: 5, comment: "Дуже корисний тест!" },
            { user: "abiba", rating: 4, comment: "Цікавий матеріал." },
            { user: "aboba", rating: 5, comment: "Дуже корисний тест!" },
            { user: "abiba", rating: 4, comment: "Цікавий матеріал." },
            { user: "aboba", rating: 5, comment: "Дуже корисний тест!" },
            { user: "abiba", rating: 4, comment: "Цікавий матеріал." },
        ],
    };

    useEffect(() => {
        localStorage.setItem("index", "0")
    }, [])

    return (
        <Wrapper enabledFooter={false} enabledSearch={true}>
            <div className={styles.quizPage}>
                <div className={styles.quizHeader}>
                    <h1 className={styles.quizTitle}>{quiz.title}</h1>

                    <div className={styles.userProfile}>
                        <img
                            className={styles.avatar}
                            src="https://i.pravatar.cc/40" alt="User Avatar" />
                        <p className={styles.username}>{quiz.author}</p>
                    </div>

                    <p>{"⭐".repeat(quiz.rating)} ({quiz.reviews} reviews)</p>

                    <div className={styles.quizDescription}>
                        <p>{quiz.description}</p>
                    </div>
                </div>

                <div className={styles.startButtonContainer}>
                    <button
                        className={styles.startButton}
                        onClick={() => navigate("/quiz/1")}>
                        <FaPlay /> Start
                    </button>
                </div>

                <div className={styles.quizReviews}>
                    <h2>Reviews</h2>
                    <div className={styles.reviewList}>
                        {quiz.latestReviews.map((review, index) => (
                            <div key={index} className={styles.review}>
                                <div className={styles.userProfile}>
                                    <img
                                        className={styles.avatar}
                                        src="https://i.pravatar.cc/40" alt="User Avatar" />
                                    <p className={styles.username}>{review.user}</p>
                                </div>
                                <p>{"⭐".repeat(review.rating)}</p>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default QuizInfoPage;