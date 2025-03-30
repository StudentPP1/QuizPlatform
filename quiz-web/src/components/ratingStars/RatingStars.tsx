import React from "react";
import styles from "./RatingStars.module.scss";

interface RatingStarsProps {
    rating: number;
    setRating: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, setRating }) => {
    return (
        <div className={styles.ratingSection}>
            <p>Rate the quiz:</p>
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= rating ? styles.filledStar : styles.emptyStar}
                        onClick={() => setRating(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        </div>
    );
};

export default RatingStars;