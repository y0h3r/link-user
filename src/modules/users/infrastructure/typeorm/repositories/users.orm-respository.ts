import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { UserOrmEntity } from '@users/infrastructure/typeorm/entities/users.orm-entity';
import { UserRepositoryPort } from '@users/application/ports/out/user-repository.port';
import { User } from '@users/domain/entities/user.entity';
import {
  UsersPaginatedResponse,
  UsersPaginationDto,
} from '@users/application/dto/user-pagination.dto';
import {
  FindUserError,
  FindUsersError,
  SaveUserError,
  UpdateUserError,
  UserNotFoundError,
} from '@users/infrastructure/typeorm/repositories/users.repository-error';
import { LoggerPort } from '@common/ports/logger.port';
import { LOGGER_PORT } from '@common/constants/tokens';

@Injectable()
export class UsersRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly entityRepository: Repository<UserOrmEntity>,
    @Inject(LOGGER_PORT)
    private readonly logger: LoggerPort,
  ) {}
  async findById(id: number): Promise<User> {
    try {
      const userEntity = await this.entityRepository.findOne({ where: { id } });

      if (!userEntity) {
        this.logger.warn('[UsersRepository] User not found', { userId: id });
        throw new UserNotFoundError();
      }

      this.logger.info('[UsersRepository] User found successfully', {
        userId: id,
      });

      return userEntity.toDomain();
    } catch (error) {
      this.logger.error('[UsersRepository] Error finding user by ID', {
        userId: id,
        error: error.message,
      });
      throw new FindUserError(error);
    }
  }

  async save(user: User): Promise<User> {
    try {
      const saved = await this.entityRepository.save(user.toEntity());
      this.logger.info('[UsersRepository] User saved successfully', {
        userId: saved.id,
        email: saved.email,
      });
      return saved.toDomain();
    } catch (error) {
      this.logger.error('[UsersRepository] Error saving user', {
        error: error.message,
      });
      throw new SaveUserError(error);
    }
  }

  async update(id: number, updates: Partial<User>): Promise<User> {
    const userToUpdate = await this.entityRepository.findOneBy({ id });
    if (!userToUpdate) {
      this.logger.warn('[UsersRepository] User not found for update', {
        userId: id,
      });
      throw new UserNotFoundError();
    }

    try {
      const mergedUser = this.entityRepository.merge(
        userToUpdate,
        this.buildPartialEntity(updates),
      );
      const savedUser = await this.entityRepository.save(mergedUser);
      this.logger.info('[UsersRepository] User updated successfully', {
        userId: savedUser.id,
        email: savedUser.email,
      });
      return savedUser.toDomain();
    } catch (error) {
      this.logger.error('[UsersRepository] Error updating user', {
        userId: id,
        error: error.message,
      });
      throw new UpdateUserError(error);
    }
  }

  async findAll(
    usersPagination: UsersPaginationDto,
  ): Promise<UsersPaginatedResponse> {
    try {
      const query = this.createUsersPaginationQuery(usersPagination);
      const [results, total] = await query.getManyAndCount();
      this.logger.info('[UsersRepository] Users fetched successfully', {
        total,
        pagination: usersPagination,
      });
      return this.buildPaginatedResponse(results, total, usersPagination);
    } catch (error) {
      this.logger.error('[UsersRepository] Error fetching users', {
        error: error.message,
      });
      throw new FindUsersError(error);
    }
  }

  private createUsersPaginationQuery(
    usersPagination: UsersPaginationDto,
  ): SelectQueryBuilder<UserOrmEntity> {
    const { page = 1, limit = 10, pageSize, cursor } = usersPagination || {};
    const take = pageSize || limit;
    const query = this.entityRepository.createQueryBuilder('user');

    if (cursor) {
      query.where('user.id > :cursor', { cursor: Number(cursor) });
      query.take(take);
    } else {
      const skip = (page - 1) * take;
      query.take(take).skip(skip);
    }

    return query;
  }

  private buildPaginatedResponse(
    users: UserOrmEntity[],
    total: number,
    paginationConfig: UsersPaginationDto,
  ): UsersPaginatedResponse {
    const { pageSize, page, limit } = paginationConfig;
    const take = pageSize || limit;
    const totalPages = Math.ceil(total / (take || 0));
    const hasNextPage = page ? page < totalPages : false;
    const hasPreviousPage = page ? page > 1 : false;

    return {
      data: users.map((entity) => entity.toDomain()),
      currentPage: page || 0,
      pageSize: take || 0,
      hasNextPage,
      hasPreviousPage,
    };
  }

  private buildPartialEntity(partialUser: Partial<User>): UserOrmEntity {
    const entity = new UserOrmEntity();
    if (partialUser.id) entity.id = partialUser.id;
    if (partialUser.firstName) entity.first_name = partialUser.firstName;
    if (partialUser.lastName) entity.last_name = partialUser.lastName;
    if (partialUser.email) entity.email = partialUser.email;
    if (partialUser.gender) entity.gender = partialUser.gender.toString();
    if (partialUser.createdAt) entity.created_at = partialUser.createdAt;
    if (partialUser.imageUrl) entity.image_url = partialUser.imageUrl;

    return entity;
  }
}
