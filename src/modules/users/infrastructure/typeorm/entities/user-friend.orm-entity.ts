import { UserFriend } from '@users/domain/entities/user-friend.entity';
import { UserOrmEntity } from '@users/infrastructure/typeorm/entities/users.orm-entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_friends')
export class UserFriendOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserOrmEntity, (user) => user.sentFriendRequests)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @ManyToOne(() => UserOrmEntity, (user) => user.receivedFriendRequests)
  @JoinColumn({ name: 'friend_id' })
  friend: UserOrmEntity;

  @CreateDateColumn()
  created_at: Date;

  toDomain(): UserFriend {
    return new UserFriend(
      this.user.toDomain(),
      this.friend.toDomain(),
      this.created_at,
      this.id,
    );
  }
}
