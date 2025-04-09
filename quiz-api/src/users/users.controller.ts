import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@common/guards/auth.guard';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  async getUserInfo(
    @Query('id') userId: string | undefined,
    @Req() req: Request & { user?: User },
  ) {
    return this.usersService.getUserInfo(userId, req.user.id);
  }
}
