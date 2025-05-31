import { UserFriendMapper } from '@users/infrastructure/graphql/mappers/user-friend.mapper';
import { UserFriend } from '@users/domain/entities/user-friend.entity';
import { UserMapper } from '@users/infrastructure/graphql/mappers/user.mapper';
import { User } from '@users/domain/entities/user.entity';
import { createFakeUserEntity } from '@test/factories/user.factory';

jest.mock('@users/infrastructure/graphql/mappers/user.mapper');

describe('UserFriendMapper', () => {
  it('should map UserFriend to UserFriendType correctly', () => {
    const user: User = createFakeUserEntity({
      id: 1,
      email: 'john@example.com',
    });
    const friend: User = createFakeUserEntity({
      id: 2,
      email: 'jane@example.com',
    });
    const userFriend: UserFriend = new UserFriend(user, friend, new Date(), 10);

    const userGraphQLMock = { id: 1, email: 'john@example.com' };
    const friendGraphQLMock = { id: 2, email: 'jane@example.com' };

    (UserMapper.toGraphQL as jest.Mock).mockImplementation((userArg: User) => {
      return userArg.email === 'john@example.com'
        ? userGraphQLMock
        : friendGraphQLMock;
    });

    const result = UserFriendMapper.toGraphQL(userFriend);

    expect(result).toEqual({
      id: 10,
      user: userGraphQLMock,
      friend: friendGraphQLMock,
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(UserMapper.toGraphQL).toHaveBeenCalledWith(user);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(UserMapper.toGraphQL).toHaveBeenCalledWith(friend);
  });
});
