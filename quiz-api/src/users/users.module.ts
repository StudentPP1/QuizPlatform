import {
  USERS_SERVICE,
  USERS_REPOSITORY,
  BASE_USERS_SERVICE,
} from '@common/constants/users.constants';
import { forwardRef, Module } from '@nestjs/common';

import { UsersRepository } from '@database/repositories/users-repository';
import { QuizModule } from '@quiz/quiz.module';
import { LoggingUsersDecorator } from '@users/logging-users.decorator';
import { ProxyUsersService } from '@users/users-proxy.service';
import { UsersController } from '@users/users.controller';
import { RealUsersService } from '@users/users.service';

@Module({
  imports: [forwardRef(() => QuizModule)],
  controllers: [UsersController],
  providers: [
    {
      provide: BASE_USERS_SERVICE,
      useClass: RealUsersService,
    },
    {
      provide: USERS_SERVICE,
      useFactory: (realService: RealUsersService) => {
        const proxy = new ProxyUsersService(realService);
        return new LoggingUsersDecorator(proxy);
      },
      inject: [BASE_USERS_SERVICE],
    },
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
  ],
  exports: [USERS_SERVICE],
})
export class UsersModule {}
