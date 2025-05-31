import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersRepository } from '@users/infrastructure/typeorm/repositories/users.orm-respository';
import { UserOrmEntity } from '@users/infrastructure/typeorm/entities/users.orm-entity';
import { LoggerPort } from '@common/ports/logger.port';
import {
  SaveUserError,
  UpdateUserError,
  UserNotFoundError,
  FindUsersError,
} from '@users/infrastructure/typeorm/repositories/users.repository-error';

import {
  createFakeUserEntity,
  createFakeUserInput,
} from '@test/factories/user.factory';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let mockEntityRepo: any;
  let mockLogger: LoggerPort;

  beforeEach(async () => {
    mockEntityRepo = {
      save: jest.fn(),
      findOneBy: jest.fn(),
      merge: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
      }),
    };

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getRepositoryToken(UserOrmEntity),
          useValue: mockEntityRepo,
        },
        { provide: 'LoggerPort', useValue: mockLogger },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  describe('save', () => {
    it('should save and return a user', async () => {
      const domainUser = createFakeUserEntity({});
      const savedEntity = {
        id: domainUser.id,
        email: domainUser.email,
        toDomain: jest.fn().mockReturnValue(domainUser),
      };

      mockEntityRepo.save.mockResolvedValue(savedEntity);

      const result = await repository.save(domainUser);
      expect(mockEntityRepo.save).toHaveBeenCalled();
      expect(result).toEqual(domainUser);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should throw SaveUserError if save fails', async () => {
      const domainUser = createFakeUserEntity({});
      mockEntityRepo.save.mockRejectedValue(new Error('save failed'));

      await expect(repository.save(domainUser)).rejects.toThrow(SaveUserError);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const updates = createFakeUserInput({ firstName: 'Jane' });
      const userEntity = {};
      const updatedUser = {
        id: 1,
        email: updates.email,
        toDomain: jest.fn().mockReturnValue(createFakeUserEntity(updates)),
      };

      mockEntityRepo.findOneBy.mockResolvedValue(userEntity);
      mockEntityRepo.merge.mockReturnValue({});
      mockEntityRepo.save.mockResolvedValue(updatedUser);

      const result = await repository.update(1, updates);
      expect(result.email).toBe(updates.email);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should throw UserNotFoundError if not found', async () => {
      mockEntityRepo.findOneBy.mockResolvedValue(null);
      await expect(repository.update(999, {})).rejects.toThrow(
        UserNotFoundError,
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should throw UpdateUserError if update fails', async () => {
      mockEntityRepo.findOneBy.mockResolvedValue({});
      mockEntityRepo.merge.mockReturnValue({});
      mockEntityRepo.save.mockRejectedValue(new Error('failed'));
      await expect(repository.update(1, {})).rejects.toThrow(UpdateUserError);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const pagination = { page: 1, limit: 10 };
      const mockUser = {
        toDomain: jest.fn().mockReturnValue({ id: 1 }),
      };
      mockEntityRepo
        .createQueryBuilder()
        .getManyAndCount.mockResolvedValue([[mockUser], 1]);

      const result = await repository.findAll(pagination);
      expect(result.data.length).toBe(1);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should throw FindUsersError if query fails', async () => {
      mockEntityRepo
        .createQueryBuilder()
        .getManyAndCount.mockRejectedValue(new Error('fail'));
      await expect(repository.findAll({ page: 1, limit: 10 })).rejects.toThrow(
        FindUsersError,
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
