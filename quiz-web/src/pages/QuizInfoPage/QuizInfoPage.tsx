import { FaPlay } from "react-icons/fa";
import styles from "./QuizInfoPage.module.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import { Quiz } from "../../models/Quiz";
import { Review } from "../../models/Review";
import { testQuiz, testReviews } from "../../test";
import Avatar from "../../components/avatar/Avatar";

export type QuizNavigate = {
    quiz: Quiz;
}

const QuizInfoPage = () => {
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [reviews, setReviews] = useState<Review[]>()

    useEffect(() => {
        // TODO: get quiz & reviews
        setQuiz(testQuiz)
        setReviews(testReviews)
        localStorage.setItem("index", "0")
    }, [])

    return (
        <Wrapper enabledFooter={false} enabledSearch={true}>
            <div className={styles.quizPage}>
                <div className={styles.quizHeader}>
                    <h1 className={styles.quizTitle}>{quiz?.title}</h1>

                    <div className={styles.userProfile} onClick={() => {
                        navigate(`/authorInfo/${quiz?.creator.id}`)
                    }}>
                        <Avatar avatarUrl={quiz?.creator.avatarUrl} />
                        <p className={styles.username}>{quiz?.creator.username}</p>
                    </div>

                    {quiz != null && (
                        <p>{"⭐".repeat(quiz.rating)} ({reviews?.length} reviews)</p>
                    )}

                    <div className={styles.quizDescription}>
                        <p>{quiz?.description}</p>
                    </div>
                </div>

                <div className={styles.startButtonContainer}>
                    <button
                        className={styles.startButton}
                        onClick={() => {
                            if (quiz != null) {
                                navigate("/quiz", { state: { quiz } as QuizNavigate })
                            }
                        }
                        }>
                        <FaPlay /> Start
                    </button>
                </div>

                <div className={styles.quizReviews}>
                    <h2>Reviews</h2>
                    <div className={styles.reviewList}>
                        {reviews?.map((review, index) => (
                            <div key={index} className={styles.review}>
                                <div className={styles.userProfile} onClick={() => {
                                    navigate(`/authorInfo/${review.creator.id}`)
                                }}>
                                    <Avatar avatarUrl={review.creator.avatarUrl} />
                                    <p className={styles.username}>{review.creator.username}</p>
                                </div>
                                <p>{"⭐".repeat(review.rating)}</p>
                                <p>{review.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default QuizInfoPage;