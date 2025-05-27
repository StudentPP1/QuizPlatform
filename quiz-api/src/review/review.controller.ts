import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Req,
  Query,
} from '@nestjs/common';

import { CreateReviewDto } from '@common/dto/create-review.dto';
import { ReviewPaginationDto } from '@common/dto/pagination.dto';
import { ReviewDto } from '@common/dto/review.dto';
import { JwtGuard } from '@common/guards/jwt.guard';
import { RequestWithUser } from '@common/interfaces/request-with-user.interface';
import { Review } from '@review/entities/review.entity';
import { ReviewService } from '@review/review.service';

@UseGuards(JwtGuard)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':quizId')
  addReview(
    @Param('quizId') quizId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Req() request: RequestWithUser,
  ): Promise<Review> {
    return this.reviewService.addReview(quizId, request.user, createReviewDto);
  }

  @Get()
  getReviewsForQuiz(@Query() dto: ReviewPaginationDto): Promise<ReviewDto[]> {
    return this.reviewService.getReviewsForQuiz(dto);
  }
}
