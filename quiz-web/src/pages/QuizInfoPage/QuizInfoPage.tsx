import { FaEdit, FaPlay } from "react-icons/fa";
import styles from "./QuizInfoPage.module.scss";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import { Quiz } from "../../models/Quiz";
import { Review } from "../../models/Review";
import Avatar from "../../components/avatar/Avatar";
import { QuizService } from "../../api/services/QuizService";
import { QuizNavigate } from "../../models/QuizNavigate";
import { AuthContext } from "../../context/context";
import { DEFAULT_PAGINATION_FROM, DEFAULT_PAGINATION_SIZE } from "../../constants/constants";
import { useObserver } from "../../hooks/useObserver";
import { usePaginatedData } from "../../hooks/usePaginatedFetch";
import Loading from "../../components/loading/Loader";

// TODO: + Task 5 => implement async/await or Promise.all()
const QuizInfoPage: FC = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const lastElement = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        localStorage.setItem("index", "0");

        const fetchData = async () => {
            if (id == null) return
            try {
                const [quizResult, reviewsResult] = await Promise.all([
                    QuizService.getQuiz(id),
                    QuizService.getReviews(DEFAULT_PAGINATION_FROM, DEFAULT_PAGINATION_SIZE, id)
                ])
                setQuiz(quizResult as Quiz);
                setReviews(reviewsResult as Review[]);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);

    const { items: newReviews, isLoading } = usePaginatedData<Review>({
        fetchFunction: QuizService.getReviews,
        observerTarget: lastElement.current,
        id,
        dependencies: [id],
        useObserverHook: useObserver,
        initFrom: DEFAULT_PAGINATION_SIZE + 1,
    });

    setReviews(newReviews)

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
                    {isLoading ? <Loading /> :
                        <div className={styles.reviewList}>
                            {reviews.map((review) => (
                                <div className={styles.review}>
                                    <div className={styles.userProfile} onClick={() => {
                                        navigate(`/authorInfo/${review.creator.userId}`)
                                    }}>
                                        <Avatar avatarUrl={review.creator.avatarUrl} />
                                        <p className={styles.username}>{review.creator.username}</p>
                                    </div>
                                    <p>{"⭐".repeat(review.rating)}</p>
                                    {review.text !== null
                                        ? <p className={styles.reviewText}>{review.text}</p>
                                        : <></>
                                    }
                                </div>
                            ))}
                        </div>}
                    <div ref={lastElement} className="last" />
                </div>
            </div>
        </Wrapper>
    );
};

export default QuizInfoPage;