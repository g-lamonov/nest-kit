import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';

import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/enums';
import { AbstractEntity } from './abstract/abstract.entity';

@Entity({
  name: 'users',
})
export class UserEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @BeforeInsert()
  @BeforeUpdate()
  protected encryptPassword(): void {
    if (!this.password) return;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);

    this.password = hash;
  }

  async passwordCompare(pwd: string): Promise<unknown> {
    return bcrypt.compareSync(pwd, this.password.replace(/^\$2y/, '$2a'));
  }
}
