import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserSelect } from 'src/user/types/user';
import { LoginRequestDto } from './dto/login-request.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { RegisterRequestDto } from './dto/register-request.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let verifyMock;

  const userServiceMock = {
    getUserByUsername: jest.fn(),
    checkUserExisting: jest.fn(),
    createUser: jest.fn(),
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

  describe('Authservice.register()', () => {
    const date = new Date();

    it('should create new user', async () => {
      const userId = 1;
      const username = 'gizmo';
      const email = 'gizmo@mail.com';
      const password = '12345678';
      const confirmPassword = '12345678';

      const payload: RegisterRequestDto = {
        username,
        email,
        password,
        confirmPassword,
      };

      type RegisterResolvedValue = {
        id: number;
        email: string;
        username: string;
        role: string;
        image: string | null;
      };

      const mockNewUser: UserSelect = {
        id: 1,
        email,
        username,
        role: 'USER',
        image: null,
        password,
        createdAt: date,
        updatedAt: date,
        deletedAt: null,
      };

      const resolvedValue: RegisterResolvedValue = {
        id: userId,
        email,
        username,
        role: 'USER',
        image: null,
      };

      userServiceMock.checkUserExisting.mockResolvedValue(null);
      userServiceMock.createUser.mockResolvedValue(mockNewUser);

      const result = await authService.register(payload);
      expect(result).toEqual(resolvedValue);
    });

    it('should throw error if user is not create', async () => {
      const username = 'gizmo';
      const email = 'gizmo@mail.com';
      const password = '12345678';
      const confirmPassword = '12345678';

      const payload: RegisterRequestDto = {
        username,
        email,
        password,
        confirmPassword,
      };

      userServiceMock.checkUserExisting.mockResolvedValue(null);
      userServiceMock.createUser.mockResolvedValue(null);

      await expect(authService.register(payload)).rejects.toThrow(
        'failed to create new user',
      );
    });

    it('should throw error if password is not confirmed', async () => {
      const username = 'gizmo';
      const email = 'gizmo@mail.com';
      const password = '12345678';
      const confirmPassword = '87654321'; // différent

      const payload: RegisterRequestDto = {
        username,
        email,
        password,
        confirmPassword,
      };

      userServiceMock.checkUserExisting.mockResolvedValue(null);

      await expect(authService.register(payload)).rejects.toThrow(
        'password is not confirmed',
      );
    });

    it('should throw error if password is not hashed', async () => {
      const username = 'gizmo';
      const email = 'gizmo@mail.com';
      const password = '12345678';
      const confirmPassword = '12345678';

      const payload: RegisterRequestDto = {
        username,
        email,
        password,
        confirmPassword,
      };

      userServiceMock.checkUserExisting.mockResolvedValue(null);
      jest.spyOn(argon2, 'hash').mockRejectedValue(new Error('hash failed'));

      await expect(authService.register(payload)).rejects.toThrow(
        'failed to hash password',
      );
    });

    it('should throw error if email already exist', async () => {
      const username = 'gizmo';
      const email = 'gizmo@mail.com';
      const password = '12345678';
      const confirmPassword = '12345678';

      const payload: RegisterRequestDto = {
        username,
        email,
        password,
        confirmPassword,
      };

      userServiceMock.checkUserExisting.mockResolvedValue({
        id: 1,
        username: 'raptor',
        email,
      });

      await expect(authService.register(payload)).rejects.toThrow(
        'email is already in use',
      );
    });

    it('should throw error if username already exist', async () => {
      const username = 'gizmo';
      const email = 'gizmo@mail.com';
      const password = '12345678';
      const confirmPassword = '12345678';

      const payload: RegisterRequestDto = {
        username,
        email,
        password,
        confirmPassword,
      };

      userServiceMock.checkUserExisting.mockResolvedValue({
        id: 1,
        username,
        email: 'dwitch@mail.com',
      });

      await expect(authService.register(payload)).rejects.toThrow(
        'username is already in use',
      );
    });
  });
});
