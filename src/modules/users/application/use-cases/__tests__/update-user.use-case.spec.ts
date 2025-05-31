import { UpdateUserUseCase } from '@users/application/use-cases/update-user.use-case';
import { UserRepositoryPort } from '@users/application/ports/out/user-repository.port';
import { LoggerPort } from '@common/ports/logger.port';
import { createFakeUserEntity } from '@test/factories/user.factory';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepositoryPort>;
  let mockLogger: jest.Mocked<LoggerPort>;

  const updatePayload = {
    firstName: 'Updated',
    email: 'updated@example.com',
  };

  const updatedUser = createFakeUserEntity({
    firstName: updatePayload.firstName,
    email: updatePayload.email,
  });

  beforeEach(() => {
    mockUserRepository = {
      update: jest.fn(),
    } as any;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

    useCase = new UpdateUserUseCase(mockUserRepository, mockLogger);
  });

  it('should update a user and log success', async () => {
    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await useCase.execute(updatedUser.id!, updatePayload);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockUserRepository.update).toHaveBeenCalledWith(
      updatedUser.id,
      updatePayload,
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.info).toHaveBeenCalledWith(
      '[UpdateUserUseCase] User updated successfully',
      expect.objectContaining({
        userId: updatedUser.id,
        email: updatedUser.email,
      }),
    );

    expect(result).toBe(updatedUser);
  });

  it('should log error and throw UpdateUserApplicationError on failure', async () => {
    const error = new Error('Update failed');
    mockUserRepository.update.mockRejectedValue(error);

    await expect(
      useCase.execute(updatedUser.id!, updatePayload),
    ).rejects.toThrow('Application failed to update user');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.error).toHaveBeenCalledWith(
      '[UpdateUserUseCase] Failed to update user',
      expect.objectContaining({
        userId: updatedUser.id,
        error: error.message,
        payload: updatePayload,
      }),
    );
  });
});
