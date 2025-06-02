import { FindAllUsersUseCase } from '@users/application/use-cases/find-all-users.use-case';
import { UserRepositoryPort } from '@users/application/ports/out/user-repository.port';
import { LoggerPort } from '@common/ports/logger.port';
import {
  UsersPaginatedResponse,
  UsersPaginationDto,
} from '@users/application/dto/user-pagination.dto';
import { createFakeUserEntity } from '@test/factories/user.factory';

describe('FindAllUsersUseCase', () => {
  let useCase: FindAllUsersUseCase;
  let mockUserRepository: jest.Mocked<UserRepositoryPort>;
  let mockLogger: jest.Mocked<LoggerPort>;

  const paginationInput: UsersPaginationDto = { page: 1, limit: 10 };

  const users = Array.from({ length: 3 }).map((_, index: number) =>
    createFakeUserEntity({ id: index }),
  );

  const mockResponse: UsersPaginatedResponse = {
    data: users,
    currentPage: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  beforeEach(() => {
    mockUserRepository = {
      findAll: jest.fn(),
    } as any;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

    useCase = new FindAllUsersUseCase(mockUserRepository, mockLogger);
  });

  it('should fetch users and log info', async () => {
    mockUserRepository.findAll.mockResolvedValue(mockResponse);

    const result = await useCase.execute(paginationInput);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockUserRepository.findAll).toHaveBeenCalledWith(paginationInput);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.info).toHaveBeenCalledWith(
      '[FindAllUsersUseCase] Fetching users with pagination',
      paginationInput,
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.info).toHaveBeenCalledWith(
      `[FindAllUsersUseCase] Fetched 3 users`,
      expect.objectContaining({
        currentPage: 1,
        pageSize: 10,
        hasNextPage: false,
        hasPreviousPage: false,
        context: 'FindAllUsersUseCase',
      }),
    );

    expect(result).toEqual(mockResponse);
  });

  it('should log error and throw FindAllUsersApplicationError on failure', async () => {
    const error = new Error('DB failed');
    mockUserRepository.findAll.mockRejectedValue(error);

    await expect(useCase.execute(paginationInput)).rejects.toThrow(
      'Application failed to fetch users',
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.error).toHaveBeenCalledWith(
      '[FindAllUsersUseCase] Failed to fetch users',
      expect.objectContaining({
        error: error.message,
        pagination: paginationInput,
      }),
    );
  });
});
