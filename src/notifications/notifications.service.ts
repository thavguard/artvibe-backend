import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotificationEntity } from "./entities/notification.entity";
import { Repository, UpdateResult } from "typeorm";
import { SendNotificationDto } from "./dtos/send-notification.dto";
import { NotificationsGateway } from "./notifications.gateway";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly NotificationRepository: Repository<NotificationEntity>,
    private readonly NotificationGateway: NotificationsGateway
  ) {}

  private async findNotiById(notiId: number): Promise<NotificationEntity> {
    return this.NotificationRepository.findOneBy({ id: notiId });
  }

  async getNotifications(userId: number): Promise<NotificationEntity[]> {
    return this.NotificationRepository.findBy({ user: { id: userId } });
  }

  async saveNotification(
    userId: number,
    saveNotiDto: SendNotificationDto
  ): Promise<NotificationEntity> {
    return this.NotificationRepository.save(
      this.NotificationRepository.create({
        user: { id: userId },
        ...saveNotiDto,
      })
    );
  }

  async changeViewed(userId: number, notiId: number): Promise<UpdateResult> {
    return this.NotificationRepository.update(notiId, { isViewed: true });
  }
}
