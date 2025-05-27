import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';

import { USERS_SERVICE } from '@common/constants/users.constants';
import { IUsersService } from '@common/contracts/services/users.service.contract';
import { BasePaginationDto } from '@common/dto/pagination.dto';
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

  @Get('profile')
  getUserInfo(
    @Query('id') userId: string | undefined,
    @Req() request: RequestWithUser,
  ): Promise<ProfileDto> {
    return this.usersService.getUserInfo(userId || request.user.id);
  }

  @Get('created')
  getCreatedQuizzes(
    @Req() request: RequestWithUser,
    @Query('userId') userId: string | undefined,
    @Query() paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]> {
    return this.usersService.getCreatedQuizzes(
      userId || request.user.id,
      paginationDto,
    );
  }

  @Get('participated')
  getParticipatedQuizzes(
    @Req() request: RequestWithUser,
    @Query() paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]> {
    return this.usersService.getParticipatedQuizzes(
      request.user.id,
      paginationDto,
    );
  }

  @Get('top-creators')
  getTopCreators(@Query('limit') limit: number = 3): Promise<ProfileDto[]> {
    return this.usersService.getTopCreators(limit);
  }
}
