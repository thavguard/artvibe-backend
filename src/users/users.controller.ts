import { UpdateUserDto } from "./dtos/update-user.dto";
import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { UserService } from "./services/users.service";

@Controller("users")
export class UserController {
  constructor(private readonly usersService: UserService) { }

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
