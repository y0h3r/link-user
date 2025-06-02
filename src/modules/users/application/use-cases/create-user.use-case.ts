import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '@users/domain/entities/user.entity';
import { UserRepositoryPort } from '@users/application/ports/out/user-repository.port';
import { CreateUserPort } from '@users/application/ports/in/create-user.port';
import { LoggerPort } from '@common/ports/logger.port';
import { BaseError } from '@common/errors/base.error';
import { LOGGER_PORT, USER_REPOSITORY_PORT } from '@common/constants/tokens';

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  imageUrl?: string;
}

@Injectable()
export class CreateUserUseCase implements CreateUserPort {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(LOGGER_PORT)
    private readonly logger: LoggerPort,
  ) {}

  async execute(data: CreateUserData): Promise<User> {
    const user = new User(
      data.firstName,
      data.lastName,
      data.email,
      data.gender,
      new Date(),
      data.imageUrl,
    );

    try {
      const userCreated = await this.userRepository.save(user);
      this.logger.info('[CreateUserUseCase] User created successfully', {
        userId: userCreated.id,
        email: userCreated.email,
      });
      return userCreated;
    } catch (error) {
      this.logger.error('[CreateUserUseCase] Failed to create user', {
        email: user.email,
        error: error.message,
      });
      throw new CreateUserApplicationError(error);
    }
  }
}

class CreateUserApplicationError extends BaseError {
  constructor(error?: Error) {
    super('Application failed to create user', HttpStatus.BAD_REQUEST, error);
  }
}
