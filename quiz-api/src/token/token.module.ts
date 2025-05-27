import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TOKEN_SERVICE } from '@common/constants/token.constants';
import { TokenController } from '@token/token.controller';
import { TokenService } from '@token/token.service';

@Module({
  imports: [JwtModule.register({ global: true })],
  controllers: [TokenController],
  providers: [{ provide: TOKEN_SERVICE, useClass: TokenService }],
  exports: [TOKEN_SERVICE],
})
export class TokenModule {}
