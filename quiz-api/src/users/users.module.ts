import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { USERS_SERVICE } from '@common/constants/user.token';
import { QuizModule } from '@quiz/quiz.module';
import { User } from '@users/entities/user.entity';
import { ProxyUsersService } from '@users/users-proxy.service';
import { UsersController } from '@users/users.controller';
import { RealUsersService } from '@users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => QuizModule)],
  controllers: [UsersController],
  providers: [
    {
      provide: USERS_SERVICE,
      useClass: ProxyUsersService,
    },
    RealUsersService,
  ],
  exports: [USERS_SERVICE],
})
export class UsersModule {}
