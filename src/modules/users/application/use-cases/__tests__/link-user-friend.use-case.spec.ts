import { LinkUserFriendUseCase } from '@users/application/use-cases/link-user-friend.use-case';
import { UserFriendRepositoryPort } from '@users/application/ports/out/user-friend-repository.port';
import { LoggerPort } from '@common/ports/logger.port';
import { User } from '@users/domain/entities/user.entity';
import { UserFriend } from '@users/domain/entities/user-friend.entity';

describe('LinkUserFriendUseCase', () => {
  let useCase: LinkUserFriendUseCase;
  let userFriendRepository: jest.Mocked<UserFriendRepositoryPort>;
  let logger: jest.Mocked<LoggerPort>;

  beforeEach(() => {
    userFriendRepository = {
      linkUser: jest.fn(),
    } as any;

    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

    useCase = new LinkUserFriendUseCase(userFriendRepository, logger);
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
    const userFriend = new UserFriend(user, friend, new Date(), 99);

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

  it('should throw LinkUserFriendApplicationError when linking fails', async () => {
    const data = { userId: 1, friendId: 2 };
    const error = new Error('Database error');
    userFriendRepository.linkUser.mockRejectedValue(error);

    await expect(useCase.execute(data)).rejects.toThrow(
      'Application failed to add user friend',
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(logger.error).toHaveBeenCalledWith(
      '[LinkUserFriendUseCase] Failed to create user',
      { error: error.message },
    );
  });
});
