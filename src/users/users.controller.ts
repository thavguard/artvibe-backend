import { UpdateUserDto } from "./dtos/update-user.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./services/users.service";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { CurrentUser } from "src/authentication/decorators/current-user-id.decorator";
import { User } from "./entities/user.entity";

@Controller("users")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  getOneById(@Param("id") id: string) {
    return this.usersService.findOneById(+id);
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.usersService.remove(id);
  }
}
