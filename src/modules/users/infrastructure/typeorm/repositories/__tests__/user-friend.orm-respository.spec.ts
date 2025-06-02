import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFriendRepository } from '@users/infrastructure/typeorm/repositories/user-friend.orm-respository';
import { UserFriendOrmEntity } from '@users/infrastructure/typeorm/entities/user-friend.orm-entity';
import { LoggerPort } from '@common/ports/logger.port';
import { UserFriend } from '@users/domain/entities/user-friend.entity';
import {
  UserFriendNotFoundAfterSaveError,
  UserFriendSaveError,
} from '@users/infrastructure/typeorm/repositories/user-friend.repository-error';
import { createFakeUserEntity } from '@test/factories/user.factory';
import { LOGGER_PORT } from '@common/constants/tokens';

const mockUser = createFakeUserEntity({ id: 1 });
const mockFriend = createFakeUserEntity({ id: 2 });

const userFriendDomain = new UserFriend(mockUser, mockFriend, new Date(), 10);

const userFriendOrmEntity: UserFriendOrmEntity = {
  id: 10,
  user: mockUser.toEntity(),
  friend: mockFriend.toEntity(),
  created_at: new Date(),
  toDomain: jest.fn().mockReturnValue(userFriendDomain),
};

describe('UserFriendRepository', () => {
  let repository: UserFriendRepository;
  let mockRepo: jest.Mocked<Repository<UserFriendOrmEntity>>;
  let mockLogger: LoggerPort;

  beforeEach(async () => {
    mockRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
    } as any;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFriendRepository,
        {
          provide: getRepositoryToken(UserFriendOrmEntity),
          useValue: mockRepo,
        },
        { provide: LOGGER_PORT, useValue: mockLogger },
      ],
    }).compile();

    repository = module.get<UserFriendRepository>(UserFriendRepository);
  });

  it('should link a user and return the domain entity', async () => {
    mockRepo.save.mockResolvedValue(userFriendOrmEntity);
    mockRepo.findOne.mockResolvedValue(userFriendOrmEntity);

    const result = await repository.linkUser(userFriendDomain);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockRepo.save).toHaveBeenCalled();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: userFriendOrmEntity.id },
      relations: ['user', 'friend'],
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.info).toHaveBeenCalled();
    expect(result).toEqual(userFriendDomain);
  });

  it('should throw UserFriendNotFoundAfterSaveError if reloaded entity is null', async () => {
    mockRepo.save.mockResolvedValue(userFriendOrmEntity);
    mockRepo.findOne.mockResolvedValue(null);

    await expect(repository.linkUser(userFriendDomain)).rejects.toThrow(
      UserFriendNotFoundAfterSaveError,
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should throw UserFriendSaveError on exception and log error', async () => {
    mockRepo.save.mockRejectedValue(new Error('DB Error'));

    await expect(repository.linkUser(userFriendDomain)).rejects.toThrow(
      UserFriendSaveError,
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
