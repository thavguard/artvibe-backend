import { SetMetadata } from "@nestjs/common";
import { PostEntity } from "src/posts/entities/post.entity";
import { User } from "src/users/entities/user.entity";
import { AccessSubject } from "../guards/access.guard";

export const CHECK_ACCESS = "CHECK_ACCESS";
export const CheckAccess = (entity: AccessSubject) =>
  SetMetadata(CHECK_ACCESS, entity);
