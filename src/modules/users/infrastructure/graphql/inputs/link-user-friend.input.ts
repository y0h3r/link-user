import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class LinkUserFriendInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  friendId: number;
}
