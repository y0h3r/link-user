import { User } from '@users/domain/entities/user.entity';

export class UsersPaginationDto {
  limit?: number;
  page?: number;
  pageSize?: number;
  cursor?: number;
}

export class UsersPaginatedResponse {
  data: User[];
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
