import {
  UserMapper,
  UsersPaginatedResponseMapper,
} from '@users/infrastructure/graphql/mappers/user.mapper';
import { createFakeUserEntity } from '@test/factories/user.factory';
import { UsersPaginatedResponse } from '@users/application/dto/user-pagination.dto';

describe('UserMapper', () => {
  it('should map User to UserType', () => {
    const user = createFakeUserEntity({ id: 123 });

    const result = UserMapper.toGraphQL(user);

    expect(result).toEqual({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      createdAt: user.createdAt,
      imageUrl: user.imageUrl,
    });
  });
});

describe('UsersPaginatedResponseMapper', () => {
  it('should map UsersPaginatedResponse to UsersPaginationType', () => {
    const user1 = createFakeUserEntity({ id: 1 });
    const user2 = createFakeUserEntity({ id: 2 });

    const paginatedResponse: UsersPaginatedResponse = {
      data: [user1, user2],
      currentPage: 2,
      pageSize: 10,
      hasNextPage: true,
      hasPreviousPage: true,
    };

    const result = UsersPaginatedResponseMapper.toGraphQL(paginatedResponse);

    expect(result).toEqual({
      data: [UserMapper.toGraphQL(user1), UserMapper.toGraphQL(user2)],
      currentPage: 2,
      pageSize: 10,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });
});
