export interface LoggerPort {
  info(message: string, context?: any): void;
  warn(message: string, context?: any): void;
  error(message: string, trace?: any, context?: any): void;
}
