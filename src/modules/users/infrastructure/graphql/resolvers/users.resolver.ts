import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { User } from '@users/domain/entities/user.entity';
import { CreateUserInput } from '@users/infrastructure/graphql/inputs/create-user.input';
import { CreateUserPort } from '@users/application/ports/in/create-user.port';
import { FindAllUsersPort } from '@users/application/ports/in/find-all-users.port';
import { Inject } from '@nestjs/common';
import {
  UserMapper,
  UsersPaginatedResponseMapper,
} from '@users/infrastructure/graphql/mappers/user.mapper';
import { UserType } from '@users/infrastructure/graphql/types/user.type';
import { UsersPaginationInput } from '@users/infrastructure/graphql/inputs/user-pagination.input';
import { UsersPaginationType } from '@users/infrastructure/graphql/types/user-pagination.type';
import { UpdateUserInput } from '@users/infrastructure/graphql/inputs/update-user.input';
import { UpdateUserPort } from '@users/application/ports/in/update-user.port';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    @Inject('CreateUserPort')
    private readonly createUserUseCase: CreateUserPort,
    @Inject('FindAllUsersPort')
    private readonly findAllUsersUseCase: FindAllUsersPort,
    @Inject('UpdateUserPort')
    private readonly updateUserUseCase: UpdateUserPort,
  ) {}

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserType> {
    const user = await this.createUserUseCase.execute(input);
    return UserMapper.toGraphQL(user);
  }

  @Mutation(() => UserType)
  async updateUser(@Args('input') input: UpdateUserInput): Promise<UserType> {
    const { id, data } = input;
    const user = await this.updateUserUseCase.execute(id, data);
    return UserMapper.toGraphQL(user);
  }

  @Query(() => UsersPaginationType)
  async findAllUsers(
    @Args('input') input: UsersPaginationInput,
  ): Promise<UsersPaginationType> {
    const response = await this.findAllUsersUseCase.execute(input);
    return UsersPaginatedResponseMapper.toGraphQL(response);
  }
}
