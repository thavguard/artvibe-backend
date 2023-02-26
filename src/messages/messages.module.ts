import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { MessageRoomEntity } from './entities/message-room.entity';
import { UserModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, MessageRoomEntity]), UserModule],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {
}
