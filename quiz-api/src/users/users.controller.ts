import {
  Controller,
  Get,
  Inject,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { USERS_SERVICE } from '@common/constants/users.constants';
import { IUsersService } from '@common/contracts/services/users.service.contract';
import { ProfileDto } from '@common/dto/profile.dto';
import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { JwtGuard } from '@common/guards/jwt.guard';
import { RequestWithUser } from '@common/interfaces/request-with-user.interface';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersService: IUsersService,
  ) {}

  @Get('/profile')
  getUserInfo(
    @Query('id') userId: string | undefined,
    @Req() request: RequestWithUser,
  ): Promise<ProfileDto> {
    return this.usersService.getUserInfo(userId || request.user.id);
  }

  @Get('created')
  getCreatedQuizzes(
    @Query('userId') userId: string,
    @Query('from', ParseIntPipe) from: number,
    @Query('to', ParseIntPipe) to: number,
  ): Promise<QuizPreviewDto[]> {
    return this.usersService.getCreatedQuizzes(userId, from, to);
  }

  @Get('participated')
  getParticipatedQuizzes(
    @Query('from', ParseIntPipe) from: number,
    @Query('to', ParseIntPipe) to: number,
    @Req() request: RequestWithUser,
  ): Promise<QuizPreviewDto[]> {
    return this.usersService.getParticipatedQuizzes(request.user.id, from, to);
  }

  @Get('top-creators')
  getTopCreators(@Query('limit') limit: number = 3): Promise<ProfileDto[]> {
    return this.usersService.getTopCreators(limit);
  }
}
