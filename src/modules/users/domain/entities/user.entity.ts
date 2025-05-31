import { Gender } from '@users/domain/constants/gender.enum';
import { UserOrmEntity } from '@users/infrastructure/typeorm/entities/users.orm-entity';

export class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public gender: Gender | string,
    public createdAt: Date,
    public imageUrl?: string,
    public readonly id?: number,
  ) {}

  toEntity(): UserOrmEntity {
    const entity = new UserOrmEntity();

    if (this.id) entity.id = this.id;
    entity.first_name = this.firstName;
    entity.last_name = this.lastName;
    entity.email = this.email;
    entity.gender = this.gender.toString();
    entity.created_at = this.createdAt;
    entity.image_url = this.imageUrl;

    return entity;
  }
}
