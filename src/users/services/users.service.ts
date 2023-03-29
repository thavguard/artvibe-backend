import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAvatarDto } from 'src/profile/dtos/update-avatar.dto';
import { DeleteResult, QueryRunner, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PhotoUserEntity } from '../entities/photo-user.entity';
import { User } from '../entities/user.entity';
import { PhotoUserService } from './photo-user.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly photoUserService: PhotoUserService,

  ) {
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations: { avatar: true, } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email }, relations: { posts: true } });

  }

  async create(
    createUserDto: CreateUserDto,
    avatar?: Express.Multer.File
  ): Promise<User> {
    const user = this.userRepository.create(createUserDto);

    const savedUser = await this.userRepository.save(user);

    if (avatar) {
      await this.updateAvatar(savedUser.id, avatar)
    }

    return savedUser
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(userId, { ...updateUserDto });
  }

  async updateAvatar(userId: number, file?: Express.Multer.File, updateAvatarDto?: UpdateAvatarDto) {
    let avatar: PhotoUserEntity;

    avatar = updateAvatarDto?.photoId
      ? await this.photoUserService.findOneById(updateAvatarDto.photoId)
      : await this.photoUserService.addPhoto(userId, file)

    return this.userRepository.update({ id: userId }, { avatar })
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }
}
