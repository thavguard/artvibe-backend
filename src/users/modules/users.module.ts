import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "../users.controller";
import { User } from "../entities/user.entity";
import { UserService } from "../services/users.service";
import { PostPhotosModule } from "src/posts/modules/post-photos.module";
import { PhotoUserModule } from "./photo-user.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), PhotoUserModule,],
  providers: [UserService,],
  controllers: [UserController],
  exports: [UserService, PhotoUserModule,],
})
export class UserModule { }
