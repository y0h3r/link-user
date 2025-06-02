import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserFriend } from '@users/domain/entities/user-friend.entity';
import { LinkUserFriendPort } from '@users/application/ports/in/link-user-friend.port';
import { LoggerPort } from '@common/ports/logger.port';
import { BaseError } from '@common/errors/base.error';
import { UserFriendRepositoryPort } from '@users/application/ports/out/user-friend-repository.port';
import { UserRepositoryPort } from '@users/application/ports/out/user-repository.port';
import {
  LOGGER_PORT,
  USER_FRIEND_REPOSITORY_PORT,
  USER_REPOSITORY_PORT,
} from '@common/constants/tokens';

interface LinkUserFriendData {
  userId: number;
  friendId: number;
}

@Injectable()
export class LinkUserFriendUseCase implements LinkUserFriendPort {
  constructor(
    @Inject(USER_FRIEND_REPOSITORY_PORT)
    private readonly userFriendRepository: UserFriendRepositoryPort,
    @Inject(LOGGER_PORT)
    private readonly logger: LoggerPort,
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(data: LinkUserFriendData): Promise<UserFriend> {
    const user = await this.userRepository.findById(data.userId);
    const friend = await this.userRepository.findById(data.friendId);

    if (!user || !friend) {
      throw new LinkUserFriendApplicationError(
        new Error('User or friend not found'),
      );
    }

    const userFriend = new UserFriend(user, friend, new Date());

    try {
      const linkUserFriendCreated =
        await this.userFriendRepository.linkUser(userFriend);
      this.logger.info('[LinkUserFriendUseCase] User added successfully', {
        userId: linkUserFriendCreated.id,
      });
      return linkUserFriendCreated;
    } catch (error) {
      this.logger.error('[LinkUserFriendUseCase] Failed to create user', {
        error: error.message,
      });
      throw new LinkUserFriendApplicationError(error);
    }
  }
}

class LinkUserFriendApplicationError extends BaseError {
  constructor(error?: Error) {
    super(
      'Application failed to add user friend',
      HttpStatus.BAD_REQUEST,
      error,
    );
  }
}
