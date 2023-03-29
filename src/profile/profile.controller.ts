import { Body, Controller, Delete, Get, Param, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { JwtAuthGuard } from "../authentication/guards/jwt-auth.guard";
import { CurrentUser } from "../authentication/decorators/current-user-id.decorator";
import { UserService } from "src/users/services/users.service";
import { DeleteResult, UpdateResult } from "typeorm";
import { UpdateProfileDto } from "./dtos/update-profile.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/multer/configs/multer.config";
import { UpdateAvatarDto } from "./dtos/update-avatar.dto";
import { PoliciesGuard } from "src/casl/guards/policies.guard";
import { CheckPolicies } from "src/casl/decorators/check-policies.decorator";
import { AppAbility } from "src/casl/factories/casl-ability.factory";
import { Action } from "src/authentication/enums/post-actions.enum";

@Controller("profile")
export class ProfileController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get("current")
  async getCurrentProfile(@CurrentUser("id") userId: number): Promise<User> {
    return this.userService.findOneById(userId);
  }

  @Get(':id')
  async getById(
    @Param('id') id: number,

  ): Promise<User> {
    return this.userService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, User)
  )
  @Put(':profileId')
  async updateProfile(
    @Param('profileId') profileId: number,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<UpdateResult> {
    return this.userService.update(profileId, updateProfileDto)
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @UseInterceptors(
    FileInterceptor('avatar', multerOptions)
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, User)
  )
  @Put(':profileId/avatar')
  async updateAvatar(
    @Param('profileId') profileId: number,
    @UploadedFile() avatar?: Express.Multer.File,
    @Body() updateAvatarDto?: UpdateAvatarDto
  ): Promise<UpdateResult> {
    return this.userService.updateAvatar(profileId, avatar, updateAvatarDto)
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, User))
  @Delete(':profileId')
  async removeProfile(
    @Param('profileId') profileId: number
  ): Promise<DeleteResult> {
    return this.userService.remove(profileId)
  }
}
