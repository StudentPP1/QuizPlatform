import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { RefreshTokenStrategy } from '@token/strategies/refresh-token.strategy';
import { TokenController } from '@token/token.controller';
import { TokenService } from '@token/token.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TokenController],
  providers: [TokenService, RefreshTokenStrategy],
  exports: [TokenService],
})
export class TokenModule {}
