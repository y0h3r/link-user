import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: parseInt(configService.get('DB_PORT') || '0'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASS'),
    database: configService.get('DB_NAME'),
    entities: [join(__dirname, '..', '**', '*.orm-entity.{ts,js}')],
    synchronize: true,
  };
};
