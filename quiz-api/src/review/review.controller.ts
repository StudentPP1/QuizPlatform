import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('api/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':quizId')
  async addReview(
    @Param('quizId') quizId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: Request,
  ) {
    return this.reviewService.addReview(quizId, createReviewDto, req);
  }

  @Get('quiz/:quizId')
  async getReviewsForQuiz(@Param('quizId') quizId: string) {
    return this.reviewService.getReviewsForQuiz(quizId);
  }
}
