import { UsersPaginatedResponse } from '@users/application/dto/user-pagination.dto';
import { User } from '@users/domain/entities/user.entity';
import { UserType } from '@users/infrastructure/graphql/types/user.type';
import { UsersPaginationType } from '@users/infrastructure/graphql/types/user-pagination.type';

export class UserMapper {
  static toGraphQL(user: User): UserType {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender as any,
      createdAt: user.createdAt,
      imageUrl: user.imageUrl,
      id: user.id,
    };
  }
}

export class UsersPaginatedResponseMapper {
  static toGraphQL(
    usersPaginated: UsersPaginatedResponse,
  ): UsersPaginationType {
    return {
      data: usersPaginated.data.map((user) => UserMapper.toGraphQL(user)),
      currentPage: usersPaginated.currentPage,
      hasNextPage: usersPaginated.hasNextPage,
      hasPreviousPage: usersPaginated.hasPreviousPage,
      pageSize: usersPaginated.pageSize,
    };
  }
}
