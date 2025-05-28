import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import {
  BASE_TOKEN_SERVICE,
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_SERVICE,
} from '@common/constants/token.constants';
import { ITokenService } from '@common/contracts/services/token.service.contract';
import { LoggingTokenDecorator } from '@token/logging-token.decorator';
import { RefreshTokenRepository } from '@token/refresh-token.repository';
import { TokenController } from '@token/token.controller';
import { TokenService } from '@token/token.service';

@Module({
  imports: [JwtModule.register({ global: true })],
  controllers: [TokenController],
  providers: [
    {
      provide: BASE_TOKEN_SERVICE,
      useClass: TokenService,
    },
    {
      provide: TOKEN_SERVICE,
      useFactory: (baseService: ITokenService) =>
        new LoggingTokenDecorator(baseService),
      inject: [BASE_TOKEN_SERVICE],
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenRepository,
    },
  ],
  exports: [TOKEN_SERVICE],
})
export class TokenModule {}
