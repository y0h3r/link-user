import { Test, TestingModule } from '@nestjs/testing';
import { UserFriendResolver } from '@users/infrastructure/graphql/resolvers/user-friend.resolver';
import { LinkUserFriendPort } from '@users/application/ports/in/link-user-friend.port';
import { UserFriend } from '@users/domain/entities/user-friend.entity';
import { UserFriendMapper } from '@users/infrastructure/graphql/mappers/user-friend.mapper';
import { LinkUserFriendInput } from '@users/infrastructure/graphql/inputs/link-user-friend.input';
import { UserFriendType } from '@users/infrastructure/graphql/types/user-friend.type';
import { createFakeUserEntity } from '@test/factories/user.factory';
import { LINK_USER_FRIEND_PORT } from '@common/constants/tokens';

describe('UserFriendResolver', () => {
  let resolver: UserFriendResolver;
  let linkUserFriendPort: jest.Mocked<LinkUserFriendPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFriendResolver,
        {
          provide: LINK_USER_FRIEND_PORT,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserFriendResolver>(UserFriendResolver);
    linkUserFriendPort = module.get(LINK_USER_FRIEND_PORT);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should call use case and return mapped UserFriendType', async () => {
    const input: LinkUserFriendInput = {
      userId: 1,
      friendId: 2,
    };

    const domainResult = new UserFriend(
      createFakeUserEntity({ id: 1 }),
      createFakeUserEntity({ id: 2 }),
      new Date(),
      10,
    );

    const mappedResult: UserFriendType = {
      id: 10,
      user: createFakeUserEntity({ id: 1 }) as any,
      friend: createFakeUserEntity({ id: 2 }) as any,
    };

    linkUserFriendPort.execute.mockResolvedValue(domainResult);
    const mapperSpy = jest
      .spyOn(UserFriendMapper, 'toGraphQL')
      .mockReturnValue(mappedResult);

    const result = await resolver.linkUserFriend(input);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(linkUserFriendPort.execute).toHaveBeenCalledWith(input);
    expect(mapperSpy).toHaveBeenCalledWith(domainResult);
    expect(result).toEqual(mappedResult);
  });
});
