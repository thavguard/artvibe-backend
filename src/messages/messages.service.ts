import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageEntity } from "./entities/message.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { MessageRoomEntity } from "./entities/message-room.entity";
import { User } from "../users/entities/user.entity";
import { CreateRoomDto } from "./dtos/create-room.dto";
import { UpdateRoomDto } from "./dtos/update-room.dto";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { use } from "passport";
import { UpdateMessageDto } from "./dtos/update-message.dto";
import { UserService } from "src/users/services/users.service";
import { PrivateRoomException } from "./exceptions/private-room.exception";
import { selectUserDto } from "src/users/dtos/select-user.dto";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(MessageRoomEntity)
    private readonly messageRoomRepository: Repository<MessageRoomEntity>,
    private readonly userService: UserService
  ) {}

  async getRoomById(roomId: number): Promise<MessageRoomEntity> {
    return this.messageRoomRepository.findOne({
      where: { id: roomId },
      relations: {
        users: true,
        messages: {
          messageRoom: true,
          user: true,
        },
      },
      select: {
        users: selectUserDto,
      },
    });
  }

  async getRoomsByUserId(userId: number): Promise<MessageRoomEntity[]> {
    return this.messageRoomRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
    });
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<MessageRoomEntity> {
    if (createRoomDto.isPrivate && createRoomDto.userIds.length > 2) {
      throw new PrivateRoomException();
    }

    const promises = createRoomDto.userIds.map((userId) =>
      this.userService.findOneById(userId)
    );

    const users = await Promise.all(promises);

    const room = this.messageRoomRepository.create({ users, ...createRoomDto });
    return this.messageRoomRepository.save(room);
  }

  async updateRoom(
    roomId: number,
    updateRoomDto: UpdateRoomDto
  ): Promise<UpdateResult> {
    return this.messageRoomRepository.update(roomId, updateRoomDto);
  }

  async removeRoom(roomId: number): Promise<DeleteResult> {
    return this.messageRoomRepository.delete(roomId);
  }

  async getMessages(roomId: number): Promise<MessageRoomEntity> {
    return await this.getRoomById(roomId);
  }

  async saveMessage(
    userId: number,
    roomId: number,
    addMessageDto: CreateMessageDto
  ): Promise<MessageEntity> {
    const user = await this.userService.findOneById(userId);
    const messageRoom = await this.getRoomById(roomId);

    const message = this.messageRepository.create({
      user,
      messageRoom,
      ...addMessageDto,
    });
    return this.messageRepository.save(message);
  }

  async updateMessage(
    messageId: number,
    updateMessageDto: UpdateMessageDto
  ): Promise<UpdateResult> {
    return this.messageRepository.update(messageId, updateMessageDto);
  }

  async removeMessage(messageId: number): Promise<DeleteResult> {
    return this.messageRepository.delete(messageId);
  }
}
