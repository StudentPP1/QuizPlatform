import winston from 'winston';

const infoOnlyFilter = winston.format((info) => {
  return info.level === 'info' ? info : false;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.prettyPrint(),
  ),
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({
      format: infoOnlyFilter(),
      filename: 'logs/info.log',
      level: 'info',
    }),
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
    }),
  ],
});

export const quizServiceLogger = logger.child({ service: 'Quiz service' });
