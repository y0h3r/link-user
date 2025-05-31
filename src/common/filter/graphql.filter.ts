import { BaseError } from '@common/errors/base.error';
import { Catch, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown) {
    if (exception instanceof BaseError) {
      const response = exception.getResponse?.();
      const responseObject =
        typeof response === 'object' && response !== null ? response : {};

      return new GraphQLError(exception.message, {
        extensions: {
          statusCode: exception.getStatus(),
          ...responseObject,
        },
      });
    }

    return new GraphQLError('Internal server error', {
      extensions: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    });
  }
}
