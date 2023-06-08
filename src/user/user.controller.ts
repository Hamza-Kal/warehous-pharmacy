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

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/:id')
  getUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createOne(body);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: Partial<CreateUserDto>) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
