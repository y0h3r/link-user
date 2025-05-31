import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '@users/domain/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserFriendOrmEntity } from '@users/infrastructure/typeorm/entities/user-friend.orm-entity';

@ObjectType()
@Entity('users')
@Unique(['email'])
export class UserOrmEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  first_name: string;

  @Field()
  @Column()
  last_name: string;

  @Field()
  @Column()
  gender: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image_url?: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => UserFriendOrmEntity, (uf) => uf.user)
  @JoinColumn({ name: 'user_id' })
  sentFriendRequests: UserFriendOrmEntity[];

  @OneToMany(() => UserFriendOrmEntity, (uf) => uf.friend)
  @JoinColumn({ name: 'friend_id' })
  receivedFriendRequests: UserFriendOrmEntity[];

  toDomain(): User {
    return new User(
      this.first_name,
      this.last_name,
      this.email,
      this.gender,
      this.created_at,
      this.image_url,
      this.id,
    );
  }
}
