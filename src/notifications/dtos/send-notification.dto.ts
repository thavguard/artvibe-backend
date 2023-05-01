import { NotificationType } from "../enums/notification-types.enum";

export class SendNotificationDto {
  type: NotificationType;
  body: string;
}
