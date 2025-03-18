import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TokenController],
  providers: [TokenService, RefreshTokenStrategy],
  exports: [TokenService],
})
export class TokenModule {}
