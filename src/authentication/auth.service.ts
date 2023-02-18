import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserService } from "../users/users.service";
import { RegistrationDto } from "./dtos/registration.dto";
import { User } from "../users/entities/user.entity";
import { DataSource } from "typeorm";
import { PostgresErrorCode } from "../database/constraints/errors.constraint";
import { UserAlreadyExistException } from "./exceptions/user-already-exist.exception";
import { AuthenticationProvider } from "./providers/authentication.provider";
import { JwtService } from "@nestjs/jwt";
import { LoginResponseDto } from "./dtos/login-response.dto";
import { AuthPayloadDto } from "./dtos/auth-payload.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService
  ) {}

  async registration(registrationDto: RegistrationDto): Promise<User> {
    let user: User;

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      user = await this.usersService.create(registrationDto, queryRunner);
    } catch (error) {
      console.log(error);

      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new UserAlreadyExistException();
      }

      throw new InternalServerErrorException();
    }

    return user;
  }

  async login(user: User): Promise<LoginResponseDto> {
    const payload: AuthPayloadDto = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
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
}
