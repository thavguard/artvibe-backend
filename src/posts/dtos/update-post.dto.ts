import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { PostPhotoEntity } from '../entities/post-photo.entity';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  photos: string;
}
