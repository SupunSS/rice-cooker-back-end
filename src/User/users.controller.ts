import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Request,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RequestUser } from '../common/interfaces/request-user.interface';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // REGISTER
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.register(createUserDto);
    return {
      message: 'Registration successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }

  // LOGIN
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { user, token } = await this.usersService.login(loginDto);

    return {
      message: 'Login successful',
      access_token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }

  // GET PROFILE
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage || '',
      subscriptionPlan: user.subscriptionPlan || 'free',
    };
  }

  // UPDATE PROFILE
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() body: UpdateProfileDto) {
    const updated = await this.usersService.updateProfile(
      req.user.userId,
      body,
    );
    return {
      message: 'Profile updated successfully',
      user: {
        id: updated._id,
        username: updated.username,
        email: updated.email,
        profileImage: updated.profileImage,
        subscriptionPlan: updated.subscriptionPlan,
      },
    };
  }

  // UPLOAD PROFILE PHOTO
  @UseGuards(JwtAuthGuard)
  @Post('profile/upload-photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-photos',
        filename: (req, file, cb) => {
          const user = req.user as RequestUser;
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${user.userId}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadProfilePhoto(
    @Request() req: { user: RequestUser },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = `http://localhost:3000/profile-photos/${file.filename}`;

    await this.usersService.updateProfile(req.user.userId, {
      profileImage: imageUrl,
    });

    return {
      message: 'Profile photo uploaded successfully',
      imageUrl,
    };
  }
}
