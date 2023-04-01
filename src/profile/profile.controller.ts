import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { JwtAuthGuard } from "../authentication/guards/jwt-auth.guard";
import { CurrentUser } from "../authentication/decorators/current-user-id.decorator";
import { UserService } from "src/users/services/users.service";
import { DeleteResult, UpdateResult } from "typeorm";
import { UpdateProfileDto } from "./dtos/update-profile.dto";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/multer/configs/multer.config";
import { UpdateAvatarDto } from "./dtos/update-avatar.dto";
import { Action } from "src/authentication/enums/post-actions.enum";
import { profileConstants } from "./constants/profile.const";
import { PhotoUserEntity } from "src/users/entities/photo-user.entity";

@Controller("profile")
export class ProfileController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get("current")
  async getCurrentProfile(@CurrentUser("id") userId: number): Promise<User> {
    return this.userService.findOneById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', multerOptions)
  )
  @Put('current/avatar')
  async updateAvatar(
    @CurrentUser("id") userId: number,
    @UploadedFile() avatar?: Express.Multer.File,
    @Body() updateAvatarDto?: UpdateAvatarDto
  ): Promise<UpdateResult> {
    return this.userService.updateAvatar(userId, avatar, updateAvatarDto)
  }

  @Get(':id')
  async getById(
    @Param('id') id: number,

  ): Promise<User> {
    return this.userService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':profileId')
  async updateProfile(
    @Param('profileId') profileId: number,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<UpdateResult> {
    return this.userService.update(profileId, updateProfileDto)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', multerOptions)
  )



  @UseGuards(JwtAuthGuard)
  @Delete(':profileId')
  async removeProfile(
    @Param('profileId') profileId: number
  ): Promise<DeleteResult> {
    return this.userService.remove(profileId)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('photos', profileConstants.maxImgCount, multerOptions))
  @Post(':profileId/photos')
  async updatePhoto(
    @Param('profileId') profileId: number,
    @UploadedFiles() photos: Express.Multer.File[]
  ): Promise<PhotoUserEntity[]> {
    return this.userService.addPhotos(profileId, photos)
  }
}
