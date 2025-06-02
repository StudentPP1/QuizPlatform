import { resolve } from 'path';

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({
  path: resolve(process.cwd(), `.env.${process.env.NODE_ENV}.local`),
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsRun: process.env.NODE_ENV === 'production',
  synchronize: process.env.NODE_ENV === 'development',
});
