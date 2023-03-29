import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostPhotosService } from "src/posts/services/post-photos.service";
import { PhotoUserEntity } from "../entities/photo-user.entity";
import { User } from "../entities/user.entity";
import { PhotoUserService } from "../services/photo-user.service";

@Module({
    imports: [TypeOrmModule.forFeature([PhotoUserEntity, User]),],
    providers: [PhotoUserService],
    exports: [PhotoUserService]
})
export class PhotoUserModule { }