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
import { Request } from 'express';

import { JwtGuard } from '@common/guards/auth.guard';
import { CreateReviewDto } from '@review/dto/create-review.dto';
import { ReviewService } from '@review/review.service';
import { User } from '@users/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':quizId')
  async addReview(
    @Param('quizId') quizId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: Request & { user?: User },
  ) {
    return this.reviewService.addReview(quizId, req.user, createReviewDto);
  }

  @Get()
  async getReviewsForQuiz(@Query('quizId') quizId: string) {
    return this.reviewService.getReviewsForQuiz(quizId);
  }
}
