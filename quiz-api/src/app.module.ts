import { join, resolve } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@auth/auth.module';
import { EventEmitterModule } from '@events/event-emitter.module';
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
      envFilePath: resolve(process.cwd(), `.env.${process.env.NODE_ENV}.local`),
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule,
    EventEmitterModule,
    TokenModule,
    ReviewModule,
    UsersModule,
    QuizModule,
  ],
})
export class AppModule {}
