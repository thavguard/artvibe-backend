import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { UserService } from '../users/users.service';
import { UserModule } from '../users/users.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [MessageGateway]
})
export class MessageModule {

}
