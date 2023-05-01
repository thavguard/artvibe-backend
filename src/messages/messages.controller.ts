import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessageEntity } from "./entities/message.entity";
import { CreateRoomDto } from "./dtos/create-room.dto";
import { MessageRoomEntity } from "./entities/message-room.entity";
import { JwtAuthGuard } from "../authentication/guards/jwt-auth.guard";
import { UpdateRoomDto } from "./dtos/update-room.dto";
import { DeleteResult, UpdateResult } from "typeorm";

@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get("/room/:roomId")
  @UseGuards(JwtAuthGuard)
  async getMessages(
    @Param("roomId", ParseIntPipe) roomId: number
  ): Promise<MessageRoomEntity> {
    return await this.messagesService.getMessages(roomId);
  }

  @Post("/room")
  @UseGuards(JwtAuthGuard)
  async createRoom(
    @Body() createRoomDto: CreateRoomDto
  ): Promise<MessageRoomEntity> {
    return this.messagesService.createRoom(createRoomDto);
  }

  @Put("/room/:roomId")
  @UseGuards(JwtAuthGuard)
  async updateRoom(
    @Param("roomId", ParseIntPipe) roomId: number,
    @Body() updateRoomDto: UpdateRoomDto
  ): Promise<UpdateResult> {
    return this.messagesService.updateRoom(roomId, updateRoomDto);
  }

  @Delete("/room/:roomId")
  @UseGuards(JwtAuthGuard)
  async removeRoom(
    @Param("roomId", ParseIntPipe) roomId: number
  ): Promise<DeleteResult> {
    return this.messagesService.removeRoom(roomId);
  }

  @Get("/room/user/:userId")
  @UseGuards(JwtAuthGuard)
  async getRoomsByUserId(
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<MessageRoomEntity[]> {
    return this.messagesService.getRoomsByUserId(userId);
  }
}
