import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '@users/domain/entities/user.entity';
import { UserRepositoryPort } from '@users/application/ports/out/user-repository.port';
import { UpdateUserPort } from '@users/application/ports/in/update-user.port';
import { LoggerPort } from '@common/ports/logger.port';
import { BaseError } from '@common/errors/base.error';
import { LOGGER_PORT, USER_REPOSITORY_PORT } from '@common/constants/tokens';

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  imageUrl?: string;
}

@Injectable()
export class UpdateUserUseCase implements UpdateUserPort {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(LOGGER_PORT)
    private readonly logger: LoggerPort,
  ) {}

  async execute(id: number, data: UpdateUserData): Promise<User> {
    try {
      const userUpdated = await this.userRepository.update(id, data);
      this.logger.info('[UpdateUserUseCase] User updated successfully', {
        userId: userUpdated.id,
        email: userUpdated.email,
      });
      return userUpdated;
    } catch (error) {
      this.logger.error('[UpdateUserUseCase] Failed to update user', {
        userId: id,
        error: error.message,
        payload: data,
      });

      throw new UpdateUserApplicationError(error);
    }
  }
}

class UpdateUserApplicationError extends BaseError {
  constructor(error?: Error) {
    super('Application failed to update user', HttpStatus.BAD_REQUEST, error);
  }
}
