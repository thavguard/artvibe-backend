import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { MessageRoomEntity } from './entities/message-room.entity';
import { UserModule } from '../users/users.module';
import { MessagesGateway } from './messages.gateway';
import { CaslModule } from '../casl/casl.module';
import { AuthModule } from '../authentication/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, MessageRoomEntity]), UserModule, CaslModule, AuthModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway]
})
export class MessagesModule {
}
