import {
  BASE_MAIL_SERVICE,
  MAIL_SERVICE,
} from '@common/constants/mail.constants';
import { Module } from '@nestjs/common';

import { IMailService } from '@common/contracts/services/mail.service.contract';
import { LoggingMailDecorator } from '@mail/logging-mail.decorator';
import { MailService } from '@mail/mail.service';

@Module({
  providers: [
    { provide: BASE_MAIL_SERVICE, useClass: MailService },
    {
      provide: MAIL_SERVICE,
      useFactory: (baseService: IMailService) =>
        new LoggingMailDecorator(baseService),
      inject: [BASE_MAIL_SERVICE],
    },
  ],
  exports: [MAIL_SERVICE],
})
export class MailModule {}
