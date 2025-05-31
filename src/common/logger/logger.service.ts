import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { LoggerPort } from '@common/ports/logger.port';

@Injectable()
export class LoggerService implements LoggerPort {
  constructor(private readonly logger: Logger) {}

  info(message: string, context?: any) {
    this.logger.log(message, context);
  }

  warn(message: string, context?: any) {
    this.logger.warn(message, context);
  }

  error(message: string, trace?: any, context?: any) {
    this.logger.error(message, { ...context, trace });
  }
}
