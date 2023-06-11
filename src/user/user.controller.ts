import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { Role } from 'src/enums/roles';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneById(id);
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<CreateUserDto>,
  ) {
    return this.userService.update(id, body);
  }

  @Delete('/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Patch('/:id')
  SetRole(@Param('id', ParseIntPipe) id: number, @Body() body: { role: Role }) {
    return this.userService.setRole(id, body.role);
  }

  @Get()
  getUsers() {
    return this.userService.find();
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createOne(body);
  }
}
