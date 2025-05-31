import { join } from 'path';

import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from '@auth/auth.module';
import {
  MAIL_SERVICE,
  USERS_SERVICE,
} from '@common/constants/service.constants';
import { IMailService } from '@common/contracts/services/mail.service.contract';
import { IUsersService } from '@common/contracts/services/users.service.contract';
import {
  registerEventListeners,
  removeEventListeners,
} from '@common/events/event-handlers';
import { DatabaseModule } from '@database/database.module';
import { MailModule } from '@mail/mail.module';
import { QuizModule } from '@quiz/quiz.module';
import { ReviewModule } from '@review/review.module';
import { configValidationSchema } from '@src/config.schema';
import { TokenModule } from '@token/token.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}.local`],
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    DatabaseModule,
    MailModule,
    TokenModule,
    ReviewModule,
    UsersModule,
    QuizModule,
  ],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(MAIL_SERVICE) private readonly mailService: IMailService,
    @Inject(USERS_SERVICE) private readonly usersService: IUsersService,
  ) {}
  onModuleInit() {
    registerEventListeners(this.mailService, this.usersService);
  }

  onModuleDestroy() {
    removeEventListeners();
  }
}
