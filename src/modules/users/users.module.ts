import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerService } from '@common/logger/logger.service';
import { UserOrmEntity } from '@users/infrastructure/typeorm/entities/users.orm-entity';
import { UsersRepository } from '@users/infrastructure/typeorm/repositories/users.orm-respository';
import { CreateUserUseCase } from '@users/application/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from '@users/application/use-cases/find-all-users.use-case';
import { UsersResolver } from '@users/infrastructure/graphql/resolvers/users.resolver';
import { UserFriendResolver } from '@users/infrastructure/graphql/resolvers/user-friend.resolver';
import { UpdateUserUseCase } from '@users/application/use-cases/update-user.use-case';
import { UserFriendRepository } from '@users/infrastructure/typeorm/repositories/user-friend.orm-respository';
import { LinkUserFriendUseCase } from '@users/application/use-cases/link-user-friend.use-case';
import { UserFriendOrmEntity } from '@users/infrastructure/typeorm/entities/user-friend.orm-entity';
@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, UserFriendOrmEntity])],
  providers: [
    CreateUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    UsersResolver,
    UserFriendResolver,
    {
      provide: 'UserRepositoryPort',
      useClass: UsersRepository,
    },
    {
      provide: 'UserFriendRepositoryPort',
      useClass: UserFriendRepository,
    },
    {
      provide: 'CreateUserPort',
      useClass: CreateUserUseCase,
    },
    {
      provide: 'UpdateUserPort',
      useClass: UpdateUserUseCase,
    },
    {
      provide: 'FindAllUsersPort',
      useClass: FindAllUsersUseCase,
    },
    {
      provide: 'LinkUserFriendPort',
      useClass: LinkUserFriendUseCase,
    },
    {
      provide: 'LoggerPort',
      useClass: LoggerService,
    },
  ],
  exports: [],
})
export class UserModule {}
