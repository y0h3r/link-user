import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '..', '**', '*.orm-entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
  synchronize: false,
  logging: true,
});
