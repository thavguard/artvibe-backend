import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { MessageRoomEntity } from './entities/message-room.entity';
import { User } from '../users/entities/user.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { CreateMessageDto } from './dtos/create-message.dto';
import { use } from 'passport';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { UserService } from 'src/users/services/users.service';

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

  async getRoomById(roomId: number): Promise<MessageRoomEntity> {
    return this.messageRoomRepository.findOne({
      where: { id: roomId }, relations: {
        users: true
      }, select: {
        users: {
          id: true,
          email: true,
          firstName: true,
          isAdmin: true,
          lastName: true,
        }
      }
    });
  }

  async getRoomsByUserId(userId: number) {
    // return  this.messageRoomRepository.findBy({users}) // TODO: fix it
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

  async getMessages(roomId: number): Promise<MessageRoomEntity> {
    return await this.getRoomById(roomId);
  }

  async saveMessage(userId: number, roomId: number, addMessageDto: CreateMessageDto): Promise<MessageEntity> {
    const user = await this.userService.findOneById(userId);
    const messageRoom = await this.getRoomById(roomId);

    const message = this.messageRepository.create({ user, messageRoom, ...addMessageDto });
    return this.messageRepository.save(message);
  }

  async updateMessage(messageId: number, updateMessageDto: UpdateMessageDto): Promise<UpdateResult> {
    return this.messageRepository.update(messageId, updateMessageDto);
  }

  async removeMessage(messageId: number): Promise<DeleteResult> {
    return this.messageRepository.delete(messageId);
  }
}
