import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegistrationDto } from "./dtos/registration.dto";
import { User } from "../users/entities/user.entity";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthResponse } from "./dtos/login-response.dto";
import { CurrentUser } from "./decorators/current-user-id.decorator";
import { RegistrationResponseDto } from "./dtos/registration-response.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/multer/configs/multer.config";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("registration")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor("avatar", multerOptions))
  async registration(
    @Body() registrationDto: RegistrationDto,
    @UploadedFile() avatar?: Express.Multer.File
  ): Promise<RegistrationResponseDto> {
    return this.authService.registration(registrationDto, avatar);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@CurrentUser() user: User): Promise<AuthResponse> {
    return this.authService.login(user);
  }
}
