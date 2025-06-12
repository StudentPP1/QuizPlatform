import { createLogger, format, transports } from 'winston';

const infoOnlyFilter = format((info) => {
  return info.level === 'info' ? info : false;
});

export const baseLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.prettyPrint(),
  ),
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({
      format: infoOnlyFilter(),
      filename: 'logs/info.log',
      level: 'info',
    }),
    new transports.File({
      filename: 'logs/errors.log',
      level: 'error',
    }),
  ],
});
