import { ProfileDto } from '@common/dto/profile.dto';
import { Review } from '@review/entities/review.entity';

export class ReviewDto {
  creator: ProfileDto;
  text?: string | null;
  rating: number;

  constructor(review: Review) {
    this.creator = new ProfileDto(review.user);
    this.text = review.comment;
    this.rating = review.rating;
  }
}
