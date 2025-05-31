import { UserFriend } from '@users/domain/entities/user-friend.entity';
import { UserFriendType } from '@users/infrastructure/graphql/types/user-friend.type';
import { UserMapper } from '@users/infrastructure/graphql/mappers/user.mapper';

export class UserFriendMapper {
  static toGraphQL(userFriend: UserFriend): UserFriendType {
    return {
      friend: UserMapper.toGraphQL(userFriend.friend),
      user: UserMapper.toGraphQL(userFriend.user),
      id: userFriend.id,
    };
  }
}
