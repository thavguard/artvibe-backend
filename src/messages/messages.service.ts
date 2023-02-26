import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { MessageRoomEntity } from './entities/message-room.entity';
import { User } from '../users/entities/user.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UserService } from '../users/users.service';
import { use } from 'passport';
import { UpdateMessageDto } from './dtos/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(MessageRoomEntity)
    private readonly messageRoomRepository: Repository<MessageRoomEntity>,
    private readonly userService: UserService
  ) {
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<MessageRoomEntity> {
    const users: User[] = [];

    for (const userId in createRoomDto.userIds) {
      const user = await this.userService.findOneById(+userId);

      users.push(user);
    }

    const room = await this.messageRoomRepository.create({ users, ...createRoomDto });
    return this.messageRoomRepository.save(room);
  }

  async updateRoom(roomId: number, updateRoomDto: UpdateRoomDto): Promise<UpdateResult> {
    return this.messageRoomRepository.update(roomId, updateRoomDto);
  }

  async removeRoom(roomId: number): Promise<DeleteResult> {
    return this.messageRoomRepository.delete(roomId);
  }

  async getMessages(roomId: number): Promise<MessageEntity[]> {
    const messageRoom = await this.messageRoomRepository.findOneBy({ id: roomId });
    return this.messageRepository.findBy({ messageRoom });
  }

  async addMessage(addMessageDto: CreateMessageDto): Promise<MessageEntity> {
    const message = this.messageRepository.create(addMessageDto);
    return this.messageRepository.save(message);
  }

  async updateMessage(messageId: number, updateMessageDto: UpdateMessageDto): Promise<UpdateResult> {
    return this.messageRepository.update(messageId, updateMessageDto);
  }

  async removeMessage(messageId: number): Promise<DeleteResult> {
    return this.messageRepository.delete(messageId);
  }
}
