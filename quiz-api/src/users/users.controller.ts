import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@common/guards/auth.guard';
import { UsersService } from '@users/users.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  async getUserInfo(@Query('id') userId: string) {
    return this.usersService.getUserInfo(userId);
  }
}
