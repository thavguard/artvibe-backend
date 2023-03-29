import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageEntity } from './entities/message.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import { MessageRoomEntity } from './entities/message-room.entity';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/decorators/check-policies.decorator';
import { AppAbility } from '../casl/factories/casl-ability.factory';
import { Action } from '../authentication/enums/post-actions.enum';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService
  ) {

  }

  @Get('/room/:roomId')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, MessageRoomEntity))
  async getMessages(
    @Param('roomId', ParseIntPipe) roomId: number
  ): Promise<MessageRoomEntity> {
    return await this.messagesService.getMessages(roomId);
  }

  @Post('/room')
  @UseGuards(JwtAuthGuard)
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<MessageRoomEntity> {
    return this.messagesService.createRoom(createRoomDto);
  }

  @Put('/room/:roomId')
  @UseGuards(JwtAuthGuard)
  async updateRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() updateRoomDto: UpdateRoomDto
  ): Promise<UpdateResult> {
    return this.messagesService.updateRoom(roomId, updateRoomDto);
  }

  @Delete('/room/:roodId')
  @UseGuards(JwtAuthGuard)
  async removeRoom(
    @Param('roomId') roomId: number
  ): Promise<DeleteResult> {
    return this.messagesService.removeRoom(roomId);
  }


}
