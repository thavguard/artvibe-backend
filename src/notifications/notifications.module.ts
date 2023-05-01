import { Module } from "@nestjs/common";
import { NotificationsGateway } from "./notifications.gateway";
import { AuthModule } from "src/authentication/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEntity } from "./entities/notification.entity";
import { NotificationsController } from "./notifications.controller";
import { NotificationService } from "./notifications.service";

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity]), AuthModule],
  controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationService],
  exports: [NotificationService, NotificationsGateway],
})
export class NotificationsModule {}
