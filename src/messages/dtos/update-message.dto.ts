import { OmitType, PickType } from "@nestjs/mapped-types";
import { CreateMessageDto } from "./create-message.dto";

export class UpdateMessageDto extends PickType(CreateMessageDto, [
  "message",
] as const) {}
