import { Module, forwardRef } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { UserModule } from "../users/modules/users.module";
import { PostsModule } from "src/posts/modules/posts.module";

@Module({
  imports: [UserModule, PostsModule,],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule { }
