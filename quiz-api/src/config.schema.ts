import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Database configuration
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
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

  // Client URL
  CLIENT_URL: Joi.string().uri().required(),
});
