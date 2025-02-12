import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUserInfo(
    @Query('userId') userId: string | undefined,
    @Req() req: Request,
  ) {
    return this.usersService.getUserInfo(req, userId);
  }
}
