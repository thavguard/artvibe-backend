import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { AuthenticationProvider } from '../providers/authentication.provider';
import { User } from '../../users/entities/user.entity';

@EventSubscriber()
export class AuthenticationSubscriber
  implements EntitySubscriberInterface<User> {

  listenTo(): Function | string {
    return User;
  }

  async beforeInsert({
    entity
  }: InsertEvent<User>): Promise<void> {
    if (entity.password) {
      entity.password = await AuthenticationProvider.generateHash(entity.password);
    }

    if (entity.email) {
      entity.email = entity.email.toLowerCase();
    }
  }

  async beforeUpdate({
    entity,
    databaseEntity
  }: UpdateEvent<User>): Promise<void> {
    if (entity.password) {
      const password = await AuthenticationProvider.generateHash(entity.password);

      if (password !== databaseEntity?.password) {
        entity.password = password;
      }
    }


  }

}
