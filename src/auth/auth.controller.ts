import {
  Request,
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/registerDto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async logIn(@Request() req) {
    return this.authService.logIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me/profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
