import { User } from '@users/domain/entities/user.entity';

export interface CreateUserPort {
  execute(data: {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    imageUrl?: string;
  }): Promise<User>;
}
