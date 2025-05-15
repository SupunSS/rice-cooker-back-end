import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.register(createUserDto);
    return {
      message: 'Registration successful',
      user: {
        username: user.username,
        email: user.email,
        id: user._id,
      },
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.login(loginDto);
    return {
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
        id: user._id,
      },
    };
  }
}
