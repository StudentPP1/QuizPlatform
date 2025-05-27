import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { LoggingAuthDecorator } from '@auth/logging-auth.decorator';
import { GoogleStrategy } from '@auth/strategies/google-oauth.strategy';
import { LocalStrategy } from '@auth/strategies/local.strategy';
import {
  AUTH_SERVICE,
  BASE_AUTH_SERVICE,
} from '@common/constants/auth.constants';
import { IAuthService } from '@common/contracts/services/auth.service.contract';
import { JwtGuard } from '@common/guards/jwt.guard';
import { TokenModule } from '@token/token.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [PassportModule, UsersModule, TokenModule],
  controllers: [AuthController],
  providers: [
    {
      provide: BASE_AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: AUTH_SERVICE,
      useFactory: (baseService: IAuthService) =>
        new LoggingAuthDecorator(baseService),
      inject: [BASE_AUTH_SERVICE],
    },
    JwtGuard,
    LocalStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
