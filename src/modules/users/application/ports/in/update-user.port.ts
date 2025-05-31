import { User } from '@users/domain/entities/user.entity';

export interface UpdateUserPort {
  execute(
    id: number,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      gender: string;
      imageUrl: string;
    }>,
  ): Promise<User>;
}
