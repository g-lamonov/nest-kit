import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractEntity {
  @CreateDateColumn({
    select: false,
    update: false,
    insert: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    select: false,
    update: false,
    insert: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    select: false,
    update: false,
    insert: false,
  })
  deletedAt: Date;
}
