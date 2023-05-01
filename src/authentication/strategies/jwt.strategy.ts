import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtStrategyValidateDto } from "../dtos/jwt-strategy-validate.dto";
import { AuthPayloadDto } from "../dtos/auth-payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: AuthPayloadDto): Promise<JwtStrategyValidateDto> {
    return {
      email: payload.email,
      id: payload.id,
    };
  }
}
