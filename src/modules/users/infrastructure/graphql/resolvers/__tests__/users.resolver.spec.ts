import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from '@users/infrastructure/graphql/resolvers/users.resolver';
import { CreateUserPort } from '@users/application/ports/in/create-user.port';
import { FindAllUsersPort } from '@users/application/ports/in/find-all-users.port';
import { UpdateUserPort } from '@users/application/ports/in/update-user.port';
import {
  UserMapper,
  UsersPaginatedResponseMapper,
} from '@users/infrastructure/graphql/mappers/user.mapper';
import {
  createFakeUserEntity,
  createFakeUserInput,
} from '@test/factories/user.factory';
import { UsersPaginationInput } from '@users/infrastructure/graphql/inputs/user-pagination.input';
import {
  CREATE_USER_PORT,
  FIND_ALL_USERS_PORT,
  UPDATE_USER_PORT,
} from '@common/constants/tokens';

jest.mock('@users/infrastructure/graphql/mappers/user.mapper');

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let createUserUseCase: CreateUserPort;
  let findAllUsersUseCase: FindAllUsersPort;
  let updateUserUseCase: UpdateUserPort;

  beforeEach(async () => {
    createUserUseCase = { execute: jest.fn() } as any;
    findAllUsersUseCase = { execute: jest.fn() } as any;
    updateUserUseCase = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        { provide: CREATE_USER_PORT, useValue: createUserUseCase },
        { provide: FIND_ALL_USERS_PORT, useValue: findAllUsersUseCase },
        { provide: UPDATE_USER_PORT, useValue: updateUserUseCase },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  describe('createUser', () => {
    it('should create a user and return GraphQL type', async () => {
      const input = createFakeUserInput();
      const domainUser = createFakeUserEntity(input);
      const gqlUser = { id: domainUser.id, email: domainUser.email };

      (createUserUseCase.execute as jest.Mock).mockResolvedValue(domainUser);
      (UserMapper.toGraphQL as jest.Mock).mockReturnValue(gqlUser);

      const result = await resolver.createUser(input);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(createUserUseCase.execute).toHaveBeenCalledWith(input);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(UserMapper.toGraphQL).toHaveBeenCalledWith(domainUser);
      expect(result).toEqual(gqlUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user and return GraphQL type', async () => {
      const input = { id: 1, data: createFakeUserInput() };
      const domainUser = createFakeUserEntity(input.data);
      const gqlUser = { id: domainUser.id, email: domainUser.email };

      (updateUserUseCase.execute as jest.Mock).mockResolvedValue(domainUser);
      (UserMapper.toGraphQL as jest.Mock).mockReturnValue(gqlUser);

      const result = await resolver.updateUser(input);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(updateUserUseCase.execute).toHaveBeenCalledWith(
        input.id,
        input.data,
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(UserMapper.toGraphQL).toHaveBeenCalledWith(domainUser);
      expect(result).toEqual(gqlUser);
    });
  });

  describe('findAllUsers', () => {
    it('should return paginated users in GraphQL format', async () => {
      const input: UsersPaginationInput = { page: 1, limit: 10 };
      const paginatedResponse = {
        data: [createFakeUserEntity({})],
        currentPage: 1,
        pageSize: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      const gqlResponse = { data: [{ id: 1 }], currentPage: 1, pageSize: 10 };

      (findAllUsersUseCase.execute as jest.Mock).mockResolvedValue(
        paginatedResponse,
      );
      (UsersPaginatedResponseMapper.toGraphQL as jest.Mock).mockReturnValue(
        gqlResponse,
      );

      const result = await resolver.findAllUsers(input);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(findAllUsersUseCase.execute).toHaveBeenCalledWith(input);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(UsersPaginatedResponseMapper.toGraphQL).toHaveBeenCalledWith(
        paginatedResponse,
      );
      expect(result).toEqual(gqlResponse);
    });
  });
});
