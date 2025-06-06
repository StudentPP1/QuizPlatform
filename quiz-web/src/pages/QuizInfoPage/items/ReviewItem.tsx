import { FC } from "react"
import { Review } from "../../../models/review/Review"
import styles from "./ReviewItem.module.scss";
import { useNavigate } from "react-router-dom";
import Avatar from "../../../components/avatar/Avatar";

const ReviewItem: FC<{ review: Review }> = ({ review }) => {
    const navigate = useNavigate();
    return (
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
    )
}

export default ReviewItem