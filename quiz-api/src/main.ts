import 'module-alias/register';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from '@src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  const clientUrl = configService.get<string>('CLIENT_URL');

  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });

  const port = configService.get<number>('PORT', 3000);

  await app.listen(port ?? 3000);
}
bootstrap();
