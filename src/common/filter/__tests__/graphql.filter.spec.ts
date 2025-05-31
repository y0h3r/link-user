import { GraphQLExceptionFilter } from '@common/filter/graphql.filter';
import { BaseError } from '@common/errors/base.error';
import { GraphQLError } from 'graphql';
import { HttpStatus } from '@nestjs/common';

describe('GraphQLExceptionFilter', () => {
  let filter: GraphQLExceptionFilter;

  beforeEach(() => {
    filter = new GraphQLExceptionFilter();
  });

  it('should return GraphQLError with BaseError details', () => {
    class CustomError extends BaseError {
      constructor() {
        super('Custom error message', HttpStatus.BAD_REQUEST);
      }

      getResponse() {
        return { custom: 'data' };
      }
    }

    const error = new CustomError();
    const result = filter.catch(error);

    expect(result).toBeInstanceOf(GraphQLError);
    expect(result.message).toBe('Custom error message');
    expect(result.extensions).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      custom: 'data',
    });
  });

  it('should return GraphQLError with internal server error details for unknown error', () => {
    const error = new Error('Something went wrong');
    const result = filter.catch(error);

    expect(result).toBeInstanceOf(GraphQLError);
    expect(result.message).toBe('Internal server error');
    expect(result.extensions).toEqual({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });
});
