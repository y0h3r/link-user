import { LinkUserFriendUseCase } from '@users/application/use-cases/link-user-friend.use-case';
import { UserFriendRepositoryPort } from '@users/application/ports/out/user-friend-repository.port';
import { UserRepositoryPort } from '@users/application/ports/out/user-repository.port';
import { LoggerPort } from '@common/ports/logger.port';
import { User } from '@users/domain/entities/user.entity';
import { UserFriend } from '@users/domain/entities/user-friend.entity';
import { UserNotFoundError } from '@users/infrastructure/typeorm/repositories/users.repository-error';

describe('LinkUserFriendUseCase', () => {
  let useCase: LinkUserFriendUseCase;
  let userFriendRepository: jest.Mocked<UserFriendRepositoryPort>;
  let userRepository: jest.Mocked<UserRepositoryPort>;
  let logger: jest.Mocked<LoggerPort>;

  beforeEach(() => {
    userFriendRepository = {
      linkUser: jest.fn(),
    } as any;

    userRepository = {
      findById: jest.fn(),
    } as any;

    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

    useCase = new LinkUserFriendUseCase(
      userFriendRepository,
      logger,
      userRepository,
    );
  });

  it('should link a user and a friend successfully', async () => {
    const data = { userId: 1, friendId: 2 };
    const user = new User('', '', '', '', new Date(), undefined, data.userId);
    const friend = new User(
      '',
      '',
      '',
      '',
      new Date(),
      undefined,
      data.friendId,
    );
    const userFriend = new UserFriend(user, friend, new Date(), 101);

    userRepository.findById.mockResolvedValueOnce(user);
    userRepository.findById.mockResolvedValueOnce(friend);
    userFriendRepository.linkUser.mockResolvedValue(userFriend);

    const result = await useCase.execute(data);

    expect(result).toBe(userFriend);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userFriendRepository.linkUser).toHaveBeenCalledWith(
      expect.any(UserFriend),
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(logger.info).toHaveBeenCalledWith(
      '[LinkUserFriendUseCase] User added successfully',
      { userId: userFriend.id },
    );
  });

  it('should throw an error if user or friend is not found', async () => {
    const data = { userId: 1, friendId: 2 };

    userRepository.findById.mockImplementation(() => {
      throw new UserNotFoundError();
    });

    await expect(useCase.execute(data)).rejects.toThrow('User not found');
  });

  it('should throw an error if repository.linkUser throws an error', async () => {
    const data = { userId: 1, friendId: 2 };
    const user = new User('', '', '', '', new Date(), undefined, data.userId);
    const friend = new User(
      '',
      '',
      '',
      '',
      new Date(),
      undefined,
      data.friendId,
    );
    const dbError = new Error('DB failure');

    userRepository.findById.mockResolvedValueOnce(user);
    userRepository.findById.mockResolvedValueOnce(friend);
    userFriendRepository.linkUser.mockRejectedValueOnce(dbError);

    await expect(useCase.execute(data)).rejects.toThrow(
      'Application failed to add user friend',
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(logger.error).toHaveBeenCalledWith(
      '[LinkUserFriendUseCase] Failed to create user',
      { error: dbError.message },
    );
  });
});
