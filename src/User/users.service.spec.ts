import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

const mockUser = {
  _id: 'user123',
  username: 'testuser',
  email: 'test@mail.com',
  password: 'hashedPassword',
};

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;
  let authService: any;

  beforeEach(async () => {
    const mockUserModelInstance = {
      save: jest.fn().mockResolvedValue(mockUser),
    };

    const mockUserModel = {
      findOne: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const mockModelConstructor = jest.fn(() => mockUserModelInstance);

    Object.assign(mockModelConstructor, mockUserModel);

    authService = {
      generateToken: jest.fn().mockReturnValue({ access_token: 'test-token' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockModelConstructor,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      userModel.findOne.mockResolvedValue(null);

      const result = await service.register({
        username: 'testuser',
        email: 'test@mail.com',
        password: '123456',
      });

      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if user exists', async () => {
      userModel.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({
          username: 'testuser',
          email: 'test@mail.com',
          password: '123456',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user with correct credentials', async () => {
      const hashedPassword = await bcrypt.hash('123456', 10);
      userModel.findOne.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      const result = await service.login({
        email: mockUser.email,
        password: '123456',
      });

      expect(result.user.email).toBe(mockUser.email);
      expect(result.token).toBe('test-token');
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'wrong@mail.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const badPassword = await bcrypt.hash('badpass', 10);
      userModel.findOne.mockResolvedValue({
        ...mockUser,
        password: badPassword,
      });

      await expect(
        service.login({ email: mockUser.email, password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      userModel.findById.mockResolvedValue(mockUser);
      const result = await service.findById('user123');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if not found', async () => {
      userModel.findById.mockResolvedValue(null);
      await expect(service.findById('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update and return user', async () => {
      userModel.findByIdAndUpdate.mockResolvedValue({
        ...mockUser,
        username: 'updated',
      });

      const result = await service.updateProfile('user123', {
        username: 'updated',
      });

      expect(result.username).toBe('updated');
    });

    it('should hash password when updating it', async () => {
      const newPassword = 'newpass';
      const hashed = await bcrypt.hash(newPassword, 10);

      userModel.findByIdAndUpdate.mockResolvedValue({
        ...mockUser,
        password: hashed,
      });

      const result = await service.updateProfile('user123', {
        password: newPassword,
      });

      const isMatch = await bcrypt.compare(newPassword, result.password);
      expect(isMatch).toBe(true);
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        service.updateProfile('bad-id', { username: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
