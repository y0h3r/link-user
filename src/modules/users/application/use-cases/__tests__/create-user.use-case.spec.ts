import { CreateUserUseCase } from '@users/application/use-cases/create-user.use-case';
import { UserRepositoryPort } from '@users/application/ports/out/user-repository.port';
import { LoggerPort } from '@common/ports/logger.port';
import { User } from '@users/domain/entities/user.entity';
import {
  createFakeUserEntity,
  createFakeUserInput,
} from '@test/factories/user.factory';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepositoryPort>;
  let mockLogger: jest.Mocked<LoggerPort>;

  const userInput = createFakeUserInput();

  const createdUser = createFakeUserEntity({ id: 1 });
  beforeEach(() => {
    mockUserRepository = {
      save: jest.fn(),
    } as any;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

    useCase = new CreateUserUseCase(mockUserRepository, mockLogger);
  });

  it('should create a user and log success', async () => {
    mockUserRepository.save.mockResolvedValue(createdUser);

    const result = await useCase.execute(userInput);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.info).toHaveBeenCalledWith(
      '[CreateUserUseCase] User created successfully',
      expect.objectContaining({
        userId: createdUser.id,
        email: createdUser.email,
      }),
    );
    expect(result).toBe(createdUser);
  });

  it('should throw CreateUserApplicationError and log failure if save fails', async () => {
    const error = new Error('DB is down');
    mockUserRepository.save.mockRejectedValue(error);

    await expect(useCase.execute(userInput)).rejects.toThrow(
      'Application failed to create user',
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.error).toHaveBeenCalledWith(
      '[CreateUserUseCase] Failed to create user',
      expect.objectContaining({
        email: userInput.email,
        error: error.message,
      }),
    );
  });
});
