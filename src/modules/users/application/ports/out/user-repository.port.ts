import {
  UsersPaginatedResponse,
  UsersPaginationDto,
} from '@users/application/dto/user-pagination.dto';
import { User } from '@users/domain/entities/user.entity';

export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findAll(usersPagination: UsersPaginationDto): Promise<UsersPaginatedResponse>;
  update(id: number, updates: Partial<User>): Promise<User>;
}
