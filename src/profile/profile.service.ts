import { Injectable } from "@nestjs/common";
import { UserService } from "../users/users.service";
import { User } from "../users/entities/user.entity";

@Injectable()
export class ProfileService {
  constructor() {}
}
