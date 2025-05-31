import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UsersPaginationInput {
  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  cursor?: number;

  @Field(() => Int, { nullable: true })
  pageSize?: number;
}
