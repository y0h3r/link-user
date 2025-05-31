import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserType } from '@users/infrastructure/graphql/types/user.type';

@ObjectType()
export class UsersPaginationType {
  @Field(() => [UserType])
  data: UserType[];

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  pageSize: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}
