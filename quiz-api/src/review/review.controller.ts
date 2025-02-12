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
import { AuthGuard } from '@nestjs/passport';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
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

  @Get('quiz')
  async getReviewsForQuiz(@Query('quizId') quizId: string) {
    return this.reviewService.getReviewsForQuiz(quizId);
  }
}
