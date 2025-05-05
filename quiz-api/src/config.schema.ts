import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Port
  PORT: Joi.number().default(3000),

  // Query configuration
  QUERY_QUEUE_CONCURRENCY: Joi.number().default(5),
  QUERY_QUEUE_DELAY_MS: Joi.number().default(500),

  // Database configuration
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // JWT configuration
  JWT_ACCESS_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRATION: Joi.string()
    .regex(/^\d+[smhd]$/)
    .required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRATION: Joi.string()
    .regex(/^\d+[smhd]$/)
    .required(),

  // Google OAuth configuration
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().uri().required(),

  // Mail configuration
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),

  // Client URL
  CLIENT_URL: Joi.string().uri().required(),
});
