import { forwardRef, Module } from '@nestjs/common';

import {
  USERS_SERVICE,
  USERS_REPOSITORY,
} from '@common/constants/users.constants';
import { QuizModule } from '@quiz/quiz.module';
import { ProxyUsersService } from '@users/users-proxy.service';
import { UsersRepository } from '@users/users-repository';
import { UsersController } from '@users/users.controller';
import { RealUsersService } from '@users/users.service';

@Module({
  imports: [forwardRef(() => QuizModule)],
  controllers: [UsersController],
  providers: [
    RealUsersService,
    {
      provide: USERS_SERVICE,
      useClass: ProxyUsersService,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
  ],
  exports: [USERS_SERVICE],
})
export class UsersModule {}
