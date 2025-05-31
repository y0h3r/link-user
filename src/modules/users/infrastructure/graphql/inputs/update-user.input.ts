import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
import { CreateUserInput } from '@users/infrastructure/graphql/inputs/create-user.input';

@InputType()
class UpdateUserDataInput extends PartialType(CreateUserInput) {}

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  id: number;

  @Field(() => UpdateUserDataInput)
  data: UpdateUserDataInput;
}
