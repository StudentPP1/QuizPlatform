import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      provide: 'IUsersService',
      useClass: ProxyUsersService,
    },
    RealUsersService,
  ],
  exports: ['IUsersService'],
})
export class UsersModule {}
