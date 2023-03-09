import { SessionStatus } from 'src/enums';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract/abstract.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'sessions',
})
export class SessionEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    enum: SessionStatus,
    nullable: false,
  })
  status!: SessionStatus;

  @Column({})
  userId!: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
