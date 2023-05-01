import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { RegistrationDto } from "./dtos/registration.dto";
import { User } from "../users/entities/user.entity";
import { DataSource } from "typeorm";
import { PostgresErrorCode } from "../database/constraints/errors.constraint";
import { UserAlreadyExistException } from "./exceptions/user-already-exist.exception";
import { AuthenticationProvider } from "./providers/authentication.provider";
import { JwtService } from "@nestjs/jwt";
import { AuthResponse } from "./dtos/login-response.dto";
import { AuthPayloadDto } from "./dtos/auth-payload.dto";
import { RegistrationResponseDto } from "./dtos/registration-response.dto";
import { UserService } from "src/users/services/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService
  ) {}

  async registration(
    registrationDto: RegistrationDto,
    avatar?: Express.Multer.File
  ): Promise<AuthResponse> {
    let user: User;
    let payload: AuthPayloadDto;

    try {
      user = await this.usersService.create(registrationDto, avatar);
      payload = { email: user.email, id: user.id };

      user = await this.usersService.findOneById(user.id);
    } catch (error) {
      console.log(error);

      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new UserAlreadyExistException();
      }

      throw new InternalServerErrorException(error);
    }

    const tokens = await this.getTokens(payload);

    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      ...tokens,
    };
  }

  async login(user: User): Promise<AuthResponse> {
    const payload: AuthPayloadDto = { email: user.email, id: user.id };

    const tokens = await this.getTokens(payload);

    return {
      ...tokens,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isMatchPassword = await AuthenticationProvider.compareHash(
        password,
        user.password
      );

      if (isMatchPassword) {
        return user;
      }

      return null;
    }
  }

  async getTokens(authPayloadDto: AuthPayloadDto): Promise<AuthResponse> {
    const payload: AuthPayloadDto = { ...authPayloadDto };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: "15m",
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: "14d",
      }),
    ]);

    await this.usersService.updateRefreshToken(
      authPayloadDto.id,
      refresh_token
    );

    return {
      access_token,
      refresh_token,
      userId: authPayloadDto.id,
    };
  }

  async verify(token: string): Promise<AuthPayloadDto> {
    return this.jwtService.verify(token);
  }
}
