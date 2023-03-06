import { Request } from 'express';
import { UserEntity } from 'src/database/entity/user.entity';

export interface RequestContext extends Request {
  user: UserEntity;
}
