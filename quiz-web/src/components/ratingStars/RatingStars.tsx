import React from "react";
import styles from "./RatingStars.module.scss";
import { FaStar } from "react-icons/fa";

interface RatingStarsProps {
    rating: number;
    setRating: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, setRating }) => {
    const ratingStars = [1, 2, 3, 4, 5];
    return (
        <div className={styles.ratingSection}>
            <p>Rate the quiz:</p>
            <div className={styles.stars}>
                {ratingStars.map((star) => (
                    <FaStar
                        key={star}
                        className={star <= rating ? styles.filledStar : styles.emptyStar}
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RatingStars;