import { FindOneOptions, FindOptionsSelect } from "typeorm"
import { PostEntity } from "../entities/post.entity"
import { selectUserDto } from "src/users/dtos/select-user.dto"
import { selectLikeDto } from "./select-like.dto"
import { selectPhotoDto } from "./select-photo.dto"

export const selectPostDto: FindOptionsSelect<PostEntity> = {
    user: selectUserDto,
    likes: selectLikeDto,
    photos: selectPhotoDto,
}