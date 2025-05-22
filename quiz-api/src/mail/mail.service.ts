import { readFile } from 'fs/promises';
import { join } from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

import { SendMailOptions } from '@common/interfaces/send-mail-options.interface';

@Injectable()
export class MailService {
  private readonly transport: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transport = createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendWelcomeEmail(options: SendMailOptions): Promise<void> {
    const templatePath = join(process.cwd(), 'src/mail/assets/welcome.txt');
    const data = await readFile(templatePath, 'utf-8');

    await this.transport.sendMail({
      from: `"Quiz App" <quizapp@gmail.com>`,
      to: options.to,
      subject: 'Welcome to QuizApp!',
      text: data.replace('{{name}}', options.username),
    });
  }
}
