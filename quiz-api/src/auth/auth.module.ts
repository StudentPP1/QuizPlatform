import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { GoogleStrategy } from '@auth/strategies/google-oauth.strategy';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { LocalStrategy } from '@auth/strategies/local.strategy';
import { TokenModule } from '@token/token.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}
