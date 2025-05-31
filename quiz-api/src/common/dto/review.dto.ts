import { ProfileDto } from '@common/dto/profile.dto';
import { Review } from '@database/entities/review.entity';

export class ReviewDto {
  creator: ProfileDto;
  text?: string | null;
  rating: number;

  constructor(review: Review) {
    this.creator = new ProfileDto(review.user);
    this.text = review.text;
    this.rating = review.rating;
  }
}
