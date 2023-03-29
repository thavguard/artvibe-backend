import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { UserModule } from "../users/modules/users.module";
import { PhotoUserModule } from "src/users/modules/photo-user.module";
import { CaslModule } from "src/casl/casl.module";

@Module({
  imports: [UserModule, CaslModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule { }
