import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@common/guards/jwt.guard';
import { User } from '@users/entities/user.entity';

import { IUsersService } from './users-service.interface';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject('IUsersService') private readonly usersService: IUsersService,
  ) {}

  @Get('/profile')
  async getUserInfo(
    @Query('id') userId: string | undefined,
    @Req() req: Request & { user?: User },
  ) {
    return this.usersService.getUserInfo(userId || req.user.id);
  }

  @Get('created')
  async getCreatedQuizzes(
    @Query('userId') userId: string,
    @Query('from') from: number,
    @Query('to') to: number,
  ) {
    return this.usersService.getCreatedQuizzes(userId, from, to);
  }

  @Get('participated')
  async getParticipatedQuizzes(
    @Query('from') from: number,
    @Query('to') to: number,
    @Req() req: Request & { user?: User },
  ) {
    return this.usersService.getParticipatedQuizzes(req.user.id, from, to);
  }

  @Get('top-creators')
  async getTopCreators(@Query('limit') limit: number = 3) {
    return this.usersService.getTopCreators(limit);
  }
}
