import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
    constructor(private readonly usersService: UserService) { }

    @Get()
    getAll() {
        return this.usersService.findAll()
    }

    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.usersService.findOne(id)
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto)
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.usersService.remove(id)
    }
}
