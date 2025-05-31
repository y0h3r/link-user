import { User } from '@users/domain/entities/user.entity';
import { UserFriendOrmEntity } from '@users/infrastructure/typeorm/entities/user-friend.orm-entity';

export class UserFriend {
  constructor(
    public readonly user: User,
    public readonly friend: User,
    public readonly createdAt: Date = new Date(),
    public readonly id?: number,
  ) {
    if (user.id === friend.id) {
      throw new Error('You cannot add yourself as a friend');
    }
  }

  toEntity(): UserFriendOrmEntity {
    const entity = new UserFriendOrmEntity();

    const userEntity = this.user.toEntity();
    const friendEntity = this.friend.toEntity();

    entity.user = userEntity;
    entity.friend = friendEntity;
    entity.created_at = this.createdAt;
    if (this.id) entity.id = this.id;

    return entity;
  }

  static fromEntity(entity: UserFriendOrmEntity): UserFriend {
    return new UserFriend(
      entity.user.toDomain(),
      entity.friend.toDomain(),
      entity.created_at,
      entity.id,
    );
  }
}
