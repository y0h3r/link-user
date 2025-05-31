import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseError extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: Error,
  ) {
    super(
      {
        statusCode: status,
        message,
        ...(error && { originalError: error.message }),
      },
      status,
    );
  }
}
