import { UserEntity } from 'src/database/entity/user.entity';
import { Mock } from '../mocks';

export class UserBuilder {
  public static generate(): Partial<UserEntity> {
    return {
      email: Mock.PersonalInfo.email(),
      firstName: Mock.PersonalInfo.firstName(),
      lastName: Mock.PersonalInfo.lastName(),
      password: Mock.PersonalInfo.password(),
    };
  }
}
