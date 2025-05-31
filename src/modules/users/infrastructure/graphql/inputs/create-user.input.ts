import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  gender: string;

  @Field({ nullable: true })
  imageUrl?: string;
}
