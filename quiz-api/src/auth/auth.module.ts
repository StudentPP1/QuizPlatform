import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { GoogleStrategy } from '@auth/strategies/google-oauth.strategy';
import { LocalStrategy } from '@auth/strategies/local.strategy';
import { AUTH_SERVICE } from '@common/constants/auth.constants';
import { JwtGuard } from '@common/guards/jwt.guard';
import { TokenModule } from '@token/token.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [PassportModule, UsersModule, TokenModule],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_SERVICE, useClass: AuthService },
    JwtGuard,
    LocalStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
