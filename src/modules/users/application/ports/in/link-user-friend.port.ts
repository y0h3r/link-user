import { UserFriend } from '@users/domain/entities/user-friend.entity';

export interface LinkUserFriendPort {
  execute(data: { userId: number; friendId: number }): Promise<UserFriend>;
}
