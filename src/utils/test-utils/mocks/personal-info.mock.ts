import * as faker from 'faker';
import { Utils } from '../../common.utils';

export class PersonalInfoMock {
  public static email(): string {
    return `${Utils.getUUID()}@email.com`;
  }
  public static firstName(): string {
    return faker.name.firstName();
  }
  public static lastName(): string {
    return faker.name.lastName();
  }
  public static password(): string {
    return faker.internet.password();
  }
}
