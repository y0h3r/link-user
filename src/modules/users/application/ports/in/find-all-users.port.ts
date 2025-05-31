import {
  UsersPaginatedResponse,
  UsersPaginationDto,
} from '@users/application/dto/user-pagination.dto';

export interface FindAllUsersPort {
  execute(usersPagination: UsersPaginationDto): Promise<UsersPaginatedResponse>;
}
