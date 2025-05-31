import { LoggerService } from '@common/logger/logger.service';
import { Logger } from 'nestjs-pino';

describe('LoggerService', () => {
  let service: LoggerService;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    service = new LoggerService(mockLogger);
  });

  describe('info', () => {
    it('should call logger.log with message and context', () => {
      const message = 'Info message';
      const context = { requestId: '123' };

      service.info(message, context);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockLogger.log).toHaveBeenCalledWith(message, context);
    });
  });

  describe('warn', () => {
    it('should call logger.warn with message and context', () => {
      const message = 'Warning';
      const context = { requestId: '456' };

      service.warn(message, context);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockLogger.warn).toHaveBeenCalledWith(message, context);
    });
  });

  describe('error', () => {
    it('should call logger.error with message, trace, and context', () => {
      const message = 'Error occurred';
      const trace = 'Stack trace';
      const context = { requestId: '789' };

      service.error(message, trace, context);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockLogger.error).toHaveBeenCalledWith(message, {
        ...context,
        trace,
      });
    });
  });
});
