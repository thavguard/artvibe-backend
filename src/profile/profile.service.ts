import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PhotoUserService } from "src/users/services/photo-user.service";
import { UserService } from "src/users/services/users.service";
import { Repository, UpdateResult } from "typeorm";
import { User } from "../users/entities/user.entity";

@Injectable()
export class ProfileService {
  constructor(

  ) { }

}
