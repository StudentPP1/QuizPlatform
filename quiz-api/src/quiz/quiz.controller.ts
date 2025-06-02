import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Get,
  Query,
  UseInterceptors,
  UploadedFiles,
  Inject,
  Put,
  Delete,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { QUIZ_SERVICE } from '@common/constants/service.constants';
import { IQuizService } from '@common/contracts/services/quiz.service.contract';
import { CreateQuizDto } from '@common/dto/create-quiz.dto';
import { FullQuizDto } from '@common/dto/full-quiz.dto';
import { QuizPaginationDto } from '@common/dto/pagination.dto';
import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { UpdateQuizDto } from '@common/dto/update-quiz.dto';
import { JwtGuard } from '@common/guards/jwt.guard';
import { RequestWithUser } from '@common/interfaces/request-with-user.interface';
import {
  MessageResponse,
  QuizIdResponse,
} from '@common/interfaces/response.interface';
import { createValidationPipe } from '@common/utils/parse-and-validate-json.factory';

@UseGuards(JwtGuard)
@Controller('quiz')
export class QuizController {
  constructor(
    @Inject(QUIZ_SERVICE) private readonly quizService: IQuizService,
  ) {}

  @Post('create')
  @UseInterceptors(AnyFilesInterceptor())
  async createQuiz(
    @Req() request: RequestWithUser,
    @Body('quiz', createValidationPipe(CreateQuizDto))
    createQuizDto: CreateQuizDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<QuizIdResponse> {
    return this.quizService.createQuiz(createQuizDto, request.user, files);
  }

  @Put('update/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async updateQuiz(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
    @Body('quiz', createValidationPipe(UpdateQuizDto))
    updateQuizDto: UpdateQuizDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<QuizIdResponse> {
    return this.quizService.updateQuiz(id, updateQuizDto, request.user, files);
  }

  @Delete('delete/:id')
  deleteQuiz(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
  ): Promise<MessageResponse> {
    return this.quizService.deleteQuiz(id, request.user);
  }

  @Post(':quizId/results')
  saveResult(
    @Param('quizId') quizId: string,
    @Req() request: RequestWithUser,
  ): Promise<MessageResponse> {
    return this.quizService.saveResult(quizId, request.user.id);
  }

  @Get(':quizId/info')
  getQuiz(@Param('quizId') quizId: string): Promise<FullQuizDto> {
    return this.quizService.getQuiz(quizId);
  }

  @Get('search')
  searchQuizzes(@Query() dto: QuizPaginationDto): Promise<QuizPreviewDto[]> {
    return this.quizService.searchQuizzesByName(dto);
  }

  @Get('top-rated')
  getTopQuizzes(@Query('limit') limit: number = 3): Promise<QuizPreviewDto[]> {
    return this.quizService.getTopQuizzes(limit);
  }
}
