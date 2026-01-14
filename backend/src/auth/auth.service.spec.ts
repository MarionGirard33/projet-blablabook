import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserSelect } from 'src/user/types/user';
import { LoginRequestDto } from './dto/login-request.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';

describe('AuthService', () => {
  let authService: AuthService;
  let verifyMock;

  const userServiceMock = {
    getUserByUsername: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, // fournis le vrai service
        { provide: UserService, useValue: userServiceMock }, // mock du UserService
        { provide: JwtService, useValue: { signAsync: jest.fn() } }, // mock du service jwt
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    // mock argon2
    verifyMock = jest.spyOn(argon2, 'verify');
    jest.spyOn(argon2, 'hash').mockResolvedValue('hashed-password');
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('sevice.login()', () => {
    const id = 1;
    const email = 'giz@mail.com';
    const username = 'giz';
    const role = 'USER';
    const image = 'https://randomuser.me/api/portraits/lego/0.jpg';
    const password = '12345678';
    const date = new Date();

    const resolvedValue: UserSelect = {
      id,
      email,
      password,
      username,
      image,
      role,
      createdAt: date,
      updatedAt: date,
      deletedAt: null,
    };

    const payload: LoginRequestDto = {
      username,
      password,
    };

    it('should return user if login is valid', async () => {
      userServiceMock.getUserByUsername.mockResolvedValue(resolvedValue);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      verifyMock.mockResolvedValueOnce(true);

      const result = await authService.login(payload);
      expect(verifyMock).toHaveBeenCalledWith(resolvedValue.password, password);
      expect(result).toBe(resolvedValue);
    });

    it('should throw error if user not exist', async () => {
      userServiceMock.getUserByUsername.mockResolvedValue(null);

      await expect(
        // eslint-disable-next-line prettier/prettier
        authService.login({ username: 'unknow', password })
      ).rejects.toThrow('username or password is invalid');
      expect(verifyMock).not.toHaveBeenCalled();
    });

    it('should throw error UnauthorizedError if password is not valid', async () => {
      userServiceMock.getUserByUsername.mockResolvedValue(resolvedValue);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      verifyMock.mockResolvedValueOnce(false);

      await expect(
        authService.login({ username, password: 'not_valid_password' }),
      ).rejects.toThrow('username or password is invalid');
    });
  });
});
