import {
  Request,
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerDto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.signup(registerDto);
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // async logIn(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('/me/profile')
  getProfile(@User() user: IUser) {
    return user;
  }
}
