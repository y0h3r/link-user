import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserFriend } from '@users/domain/entities/user-friend.entity';
import { Inject } from '@nestjs/common';
import { UserFriendMapper } from '@users/infrastructure/graphql/mappers/user-friend.mapper';
import { UserFriendType } from '@users/infrastructure/graphql/types/user-friend.type';
import { LinkUserFriendInput } from '@users/infrastructure/graphql/inputs/link-user-friend.input';
import { LinkUserFriendPort } from '@users/application/ports/in/link-user-friend.port';
import { LINK_USER_FRIEND_PORT } from '@common/constants/tokens';

@Resolver(() => UserFriend)
export class UserFriendResolver {
  constructor(
    @Inject(LINK_USER_FRIEND_PORT)
    private readonly linkUserFriendUseCase: LinkUserFriendPort,
  ) {}

  @Mutation(() => UserFriendType)
  async linkUserFriend(
    @Args('input') input: LinkUserFriendInput,
  ): Promise<UserFriendType> {
    const userFriend = await this.linkUserFriendUseCase.execute(input);
    return UserFriendMapper.toGraphQL(userFriend);
  }
}
