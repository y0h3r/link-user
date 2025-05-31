import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Gender } from '@users/domain/constants/gender.enum';

@ObjectType()
export class UserType {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => String)
  gender: Gender;

  @Field(() => Date)
  createdAt: Date;

  @Field({ nullable: true })
  imageUrl?: string;
}
