import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '@users/application/ports/out/user-repository.port';
import { FindAllUsersPort } from '@users/application/ports/in/find-all-users.port';
import {
  UsersPaginatedResponse,
  UsersPaginationDto,
} from '@users/application/dto/user-pagination.dto';
import { LoggerPort } from '@common/ports/logger.port';
import { BaseError } from '@common/errors/base.error';

@Injectable()
export class FindAllUsersUseCase implements FindAllUsersPort {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    @Inject('LoggerPort')
    private readonly logger: LoggerPort,
  ) {}

  async execute(
    usersPagination: UsersPaginationDto,
  ): Promise<UsersPaginatedResponse> {
    try {
      this.logger.info(
        `[FindAllUsersUseCase] Fetching users with pagination`,
        usersPagination,
      );
      const result = await this.userRepository.findAll(usersPagination);
      this.logger.info(
        `[FindAllUsersUseCase] Fetched ${result.data.length} users`,
        {
          ...{ ...result, data: undefined },
          context: FindAllUsersUseCase.name,
        },
      );
      return result;
    } catch (error) {
      this.logger.error('[FindAllUsersUseCase] Failed to fetch users', {
        error: error.message,
        pagination: usersPagination,
      });

      throw new FindAllUsersApplicationError(error);
    }
  }
}

class FindAllUsersApplicationError extends BaseError {
  constructor(error?: Error) {
    super('Application failed to create user', HttpStatus.BAD_REQUEST, error);
  }
}
