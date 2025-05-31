import { UserFriend } from '@users/domain/entities/user-friend.entity';

export interface UserFriendRepositoryPort {
  linkUser(linkUser: UserFriend): Promise<UserFriend>;
}
