import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { UserFriendRepositoryPort } from '@users/application/ports/out/user-friend-repository.port';
import { LoggerPort } from '@common/ports/logger.port';
import { UserFriend } from '@users/domain/entities/user-friend.entity';
import { UserFriendOrmEntity } from '@users/infrastructure/typeorm/entities/user-friend.orm-entity';
import {
  UserFriendSaveError,
  UserFriendNotFoundAfterSaveError,
} from '@users/infrastructure/typeorm/repositories/user-friend.repository-error';
import { BaseError } from '@common/errors/base.error';
import { LOGGER_PORT } from '@common/constants/tokens';

@Injectable()
export class UserFriendRepository implements UserFriendRepositoryPort {
  constructor(
    @InjectRepository(UserFriendOrmEntity)
    private readonly entityRepository: Repository<UserFriendOrmEntity>,
    @Inject(LOGGER_PORT)
    private readonly logger: LoggerPort,
  ) {}

  async linkUser(user: UserFriend): Promise<UserFriend> {
    try {
      const saved = await this.entityRepository.save(user.toEntity());

      const reloaded = await this.entityRepository.findOne({
        where: { id: saved.id },
        relations: ['user', 'friend'],
      });

      if (!reloaded) {
        throw new UserFriendNotFoundAfterSaveError();
      }

      this.logger.info(
        '[UserFriendRepository] Friend link created successfully',
        {
          userId: reloaded.user.id,
          friendId: reloaded.friend.id,
          linkId: reloaded.id,
        },
      );

      return reloaded.toDomain();
    } catch (error) {
      this.logger.error('[UserFriendRepository] Error creating friend link', {
        userId: user.user.id,
        friendId: user.friend.id,
        error: error.message,
      });

      if (error instanceof BaseError) {
        throw error;
      }

      throw new UserFriendSaveError(error);
    }
  }
}
