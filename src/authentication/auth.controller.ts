import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegistrationDto } from "./dtos/registration.dto";
import { User } from "../users/entities/user.entity";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { LoginResponseDto } from "./dtos/login-response.dto";
import { CurrentUser } from "./decorators/current-user-id.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("registration")
  @HttpCode(HttpStatus.OK)
  async registration(@Body() registrationDto: RegistrationDto): Promise<User> {
    return this.authService.registration(registrationDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@CurrentUser() user: User): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }
}
