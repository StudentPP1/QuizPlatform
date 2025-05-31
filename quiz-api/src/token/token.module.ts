import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { REFRESH_TOKEN_REPOSITORY } from '@common/constants/repository.constants';
import {
  BASE_TOKEN_SERVICE,
  TOKEN_SERVICE,
} from '@common/constants/service.constants';
import { ITokenService } from '@common/contracts/services/token.service.contract';
import { RefreshTokenRepository } from '@database/repositories/refresh-token.repository';
import { LoggingTokenDecorator } from '@token/logging-token.decorator';
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
