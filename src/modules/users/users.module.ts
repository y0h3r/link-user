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
import {
  CREATE_USER_PORT,
  FIND_ALL_USERS_PORT,
  LINK_USER_FRIEND_PORT,
  LOGGER_PORT,
  UPDATE_USER_PORT,
  USER_FRIEND_REPOSITORY_PORT,
  USER_REPOSITORY_PORT,
} from '@common/constants/tokens';

const REPOSITORY_PROVIDERS = [
  {
    provide: USER_REPOSITORY_PORT,
    useClass: UsersRepository,
  },
  {
    provide: USER_FRIEND_REPOSITORY_PORT,
    useClass: UserFriendRepository,
  },
];

const USE_CASE_PROVIDERS = [
  {
    provide: CREATE_USER_PORT,
    useClass: CreateUserUseCase,
  },
  {
    provide: UPDATE_USER_PORT,
    useClass: UpdateUserUseCase,
  },
  {
    provide: FIND_ALL_USERS_PORT,
    useClass: FindAllUsersUseCase,
  },
  {
    provide: LINK_USER_FRIEND_PORT,
    useClass: LinkUserFriendUseCase,
  },
];
@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, UserFriendOrmEntity])],
  providers: [
    UsersResolver,
    UserFriendResolver,
    ...REPOSITORY_PROVIDERS,
    ...USE_CASE_PROVIDERS,
    {
      provide: LOGGER_PORT,
      useClass: LoggerService,
    },
  ],
  exports: [UserModule],
})
export class UserModule {}
