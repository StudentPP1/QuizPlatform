import { SendMailOptions } from '@common/interfaces/send-mail-options.interface';

export interface IMailService {
  sendWelcomeEmail(options: SendMailOptions): Promise<void>;
}
