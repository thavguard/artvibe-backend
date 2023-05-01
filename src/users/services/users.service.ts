import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateAvatarDto } from "src/profile/dtos/update-avatar.dto";
import { DeleteResult, QueryRunner, Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { PhotoUserEntity } from "../entities/photo-user.entity";
import { User } from "../entities/user.entity";
import { PhotoUserService } from "./photo-user.service";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { AuthenticationProvider } from "src/authentication/providers/authentication.provider";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly photoUserService: PhotoUserService
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        avatar: true,
        photos: true,
        friends: {
          receivedFriends: true,
          sentFriends: true,
          friends: true,
        },
      },
    });

    if (!user) {
      throw new UserNotFoundException(id);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      relations: { posts: true },
    });
  }

  async create(
    createUserDto: CreateUserDto,
    avatar?: Express.Multer.File
  ): Promise<User> {
    const user = this.userRepository.create(createUserDto);

    user.password = await AuthenticationProvider.generateHash(user.password);

    const savedUser = await this.userRepository.save(user);

    if (avatar) {
      await this.updateAvatar(savedUser.id, avatar);
    }

    return savedUser;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const password = await AuthenticationProvider.generateHash(
      updateUserDto.password
    );
    return this.userRepository.update(userId, { ...updateUserDto, password });
  }

  async updateAvatar(
    userId: number,
    file?: Express.Multer.File,
    updateAvatarDto?: UpdateAvatarDto
  ) {
    let avatar: PhotoUserEntity;

    avatar = updateAvatarDto?.photoId
      ? await this.photoUserService.findOneById(updateAvatarDto.photoId)
      : await this.photoUserService.addPhoto(userId, file);

    return this.userRepository.update({ id: userId }, { avatar });
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string
  ): Promise<UpdateResult> {
    const hashedRefreshToken = await AuthenticationProvider.generateHash(
      refreshToken
    );

    return this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async addPhoto(
    userId: number,
    photo: Express.Multer.File
  ): Promise<PhotoUserEntity> {
    return this.photoUserService.addPhoto(userId, photo);
  }

  async addPhotos(
    userId: number,
    photos: Express.Multer.File[]
  ): Promise<PhotoUserEntity[]> {
    return this.photoUserService.addPhotos(userId, photos);
  }

  async removePhoto(userId: number, photoId: number): Promise<DeleteResult> {
    return this.photoUserService.removePhoto(userId, photoId);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }

  public saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
