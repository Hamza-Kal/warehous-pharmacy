import {
  Request,
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { registerSchema } from 'class-validator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerDto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async logIn(@Request() req) {
    console.log('login controller\n', req.user);
    return this.authService.logIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    console.log('profile controller\n', req.user);
    return req.user;
  }
}
