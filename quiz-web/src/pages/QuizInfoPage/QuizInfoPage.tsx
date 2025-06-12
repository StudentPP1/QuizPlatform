import { FaEdit, FaPlay } from "react-icons/fa";
import styles from "./QuizInfoPage.module.scss";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import Avatar from "../../components/avatar/Avatar";
import { QuizService } from "../../api/services/QuizService";
import { QuizNavigate } from "../../models/quiz/QuizNavigate";
import { AuthContext } from "../../context/context";
import { DEFAULT_PAGINATION_FROM, DEFAULT_PAGINATION_SIZE } from "../../constants/constants";
import Loading from "../../components/loading/Loader";
import { useObserver } from "../../hooks/useObserver";
import { usePaginatedData } from "../../hooks/usePaginatedFetch";
import { Quiz } from "../../models/quiz/Quiz";
import { Review } from "../../models/review/Review";
import ReviewItem from "./items/ReviewItem";

const QuizInfoPage: FC = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const lastElement = useRef<HTMLDivElement | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [from, setFrom] = useState(DEFAULT_PAGINATION_FROM);

    useEffect(() => {
        localStorage.setItem("index", "0");
        const fetchData = async () => {
            if (id == null) return
            // TODO: + Task 5 => implemented by using Promise.all()
            const [quizResult, reviewsResult] = await Promise.all([
                QuizService.getQuiz(id),
                QuizService.getReviews(from, from + DEFAULT_PAGINATION_SIZE, id)
            ])
            console.log("QuizInfoPage: quizResult", quizResult);
            setQuiz(quizResult as Quiz);
            setReviews(reviewsResult as Review[]);
            setFrom(from + DEFAULT_PAGINATION_SIZE);
        };
        fetchData();
    }, []);

    usePaginatedData<Review>({
        fetchFunction: QuizService.getReviews,
        observerTarget: lastElement,
        data: id,
        dependencies: [id],
        useObserverHook: useObserver,
        setItems: setReviews,
        initFrom: from,
        isLoading: isLoading,
        setLoading: setLoading,
    });

    return (
        <Wrapper>
            <div className={styles.quizPage}>
                <div className={styles.quizHeader}>
                    <h1 className={styles.quizTitle}>{quiz?.title}</h1>

                    <div className={styles.quizDescription}>
                        <p>{quiz?.description}</p>
                    </div>

                    {quiz != null && (
                        <p>{"⭐".repeat(quiz.rating)} ({reviews?.length} reviews)</p>
                    )}

                    <div className={styles.userProfile} onClick={() => {
                        navigate(`/authorInfo/${quiz?.creator.userId}`)
                    }}>
                        <Avatar avatarUrl={quiz?.creator.avatarUrl} />
                        <p className={styles.username}>{quiz?.creator.username}</p>
                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button
                        className={styles.controlButton}
                        onClick={() => {
                            if (quiz != null) {
                                navigate("/quiz", { state: { quiz } as QuizNavigate })
                            }
                        }
                        }>
                        <FaPlay /> Start
                    </button>
                    {quiz?.creator.userId == user?.userId &&
                        <button
                            className={styles.controlButton}
                            onClick={() => {
                                if (quiz != null) {
                                    navigate("/edit-quiz", { state: { quiz } as QuizNavigate })
                                }
                            }
                            }>
                            <FaEdit /> Edit
                        </button>
                    }
                </div>

                <div className={styles.quizReviews}>
                    <h2>Reviews</h2>
                </div>
                <div className={styles.content_container}>
                    {isLoading ? <Loading /> :
                        <div className={styles.reviewList}>
                            {reviews.map((review, index) => (
                                <ReviewItem key={index} review={review} />
                            ))}
                        </div>}
                </div>
                <div ref={lastElement} className="last" />
            </div>
        </Wrapper>
    );
};

export default QuizInfoPage;