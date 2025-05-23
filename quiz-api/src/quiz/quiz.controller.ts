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
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Request } from 'express';

import { QUIZ_SERVICE } from '@common/constants/quiz.constants';
import { IQuizService } from '@common/contracts/services/quiz.service.contract';
import { CreateQuizDto } from '@common/dto/create-quiz.dto';
import { SaveQuizResultDto } from '@common/dto/save-quiz-result.dto';
import { UpdateQuizDto } from '@common/dto/update-quiz.dto';
import { JwtGuard } from '@common/guards/jwt.guard';
import { User } from '@users/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('quiz')
export class QuizController {
  constructor(
    @Inject(QUIZ_SERVICE) private readonly quizService: IQuizService,
  ) {}

  @Post('create')
  @UseInterceptors(AnyFilesInterceptor())
  async createQuiz(
    @Req() req: Request & { user?: User },
    @Body('quiz') quizRaw: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const createQuizDto = plainToInstance(CreateQuizDto, JSON.parse(quizRaw));
    await validateOrReject(createQuizDto);

    for (const file of files) {
      const match = file.fieldname.match(/images\[(\d+)\]/);
      if (match) {
        const index = parseInt(match[1], 10);
        if (createQuizDto.tasks[index]) {
          createQuizDto.tasks[index].image = `/uploads/${file.filename}`;
        }
      }
    }

    const quiz = await this.quizService.createQuiz(createQuizDto, req.user);
    return quiz;
  }

  @Put('update/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async updateQuiz(
    @Param('id') id: string,
    @Req() req: Request & { user?: User },
    @Body('quiz') quizRaw: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const updateQuizDto = plainToInstance(UpdateQuizDto, JSON.parse(quizRaw));
    await validateOrReject(updateQuizDto);

    for (const file of files) {
      const match = file.fieldname.match(/images\[(\d+)\]/);
      if (match) {
        const index = parseInt(match[1], 10);
        if (updateQuizDto.tasks?.[index]) {
          updateQuizDto.tasks[index].image = `/uploads/${file.filename}`;
        }
      }
    }

    const result = await this.quizService.updateQuiz(
      id,
      updateQuizDto,
      req.user,
    );
    return result;
  }

  @Delete('delete/:id')
  async deleteQuiz(
    @Param('id') id: string,
    @Req() req: Request & { user?: User },
  ) {
    return await this.quizService.deleteQuiz(id, req.user);
  }

  @Post(':quizId/results')
  async saveResult(
    @Param('quizId') quizId: string,
    @Body() saveQuizResultDto: SaveQuizResultDto,
    @Req() req: Request & { user?: User },
  ) {
    return this.quizService.saveResult(quizId, req.user.id, saveQuizResultDto);
  }

  @Get(':quizId/info')
  async getQuiz(@Param('quizId') quizId: string) {
    return this.quizService.getQuiz(quizId);
  }

  @Get('search')
  async searchQuizzes(@Query('name') name: string) {
    return this.quizService.searchQuizzesByName(name);
  }

  @Get('top-rated')
  async getTopQuizzes(@Query('limit') limit: number = 3) {
    return this.quizService.getTopQuizzes(limit);
  }
}
