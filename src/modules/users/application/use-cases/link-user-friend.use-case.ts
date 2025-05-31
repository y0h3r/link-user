import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserFriend } from '@users/domain/entities/user-friend.entity';
import { LinkUserFriendPort } from '@users/application/ports/in/link-user-friend.port';
import { LoggerPort } from '@common/ports/logger.port';
import { BaseError } from '@common/errors/base.error';
import { UserFriendRepositoryPort } from '../ports/out/user-friend-repository.port';
import { User } from '@users/domain/entities/user.entity';

interface LinkUserFriendData {
  userId: number;
  friendId: number;
}

@Injectable()
export class LinkUserFriendUseCase implements LinkUserFriendPort {
  constructor(
    @Inject('UserFriendRepositoryPort')
    private readonly userFriendRepository: UserFriendRepositoryPort,
    @Inject('LoggerPort')
    private readonly logger: LoggerPort,
  ) {}

  async execute(data: LinkUserFriendData): Promise<UserFriend> {
    const user = new User('', '', '', '', new Date(), undefined, data.userId);
    const friend = new User(
      '',
      '',
      '',
      '',
      new Date(),
      undefined,
      data.friendId,
    );

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
