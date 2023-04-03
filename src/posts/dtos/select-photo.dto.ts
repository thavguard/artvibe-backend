import { FindOptionsSelect } from "typeorm";
import { PostPhotoEntity } from "../entities/post-photo.entity";

export const selectPhotoDto: FindOptionsSelect<PostPhotoEntity> = {
    id: true,
    filename: true,
}