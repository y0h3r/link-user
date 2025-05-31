import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserType } from '@users/infrastructure/graphql/types/user.type';

@ObjectType()
export class UserFriendType {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => UserType)
  user: UserType;

  @Field(() => UserType)
  friend: UserType;
}
