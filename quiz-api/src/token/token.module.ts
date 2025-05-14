import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TokenController } from '@token/token.controller';
import { TokenService } from '@token/token.service';

@Module({
  imports: [JwtModule.register({ global: true })],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
