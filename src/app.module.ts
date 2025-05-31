import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLConfig } from '@config/graphql.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from '@config/env.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '@config/typeorm.config';
import { UserModule } from '@users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLExceptionFilter } from '@common/filter/graphql.filter';

@Module({
  imports: [
    GraphQLConfig,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore:
              'pid,hostname,req.headers,res.headers,responseTime,res,req,err',
          },
        },
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GraphQLExceptionFilter,
    },
  ],
})
export class AppModule {}
