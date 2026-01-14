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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, // fournis le vrai service
        { provide: UserService, useValue: userServiceMock }, // mock du UserService
        { provide: JwtService, useValue: { signAsync: jest.fn() } }, // mock du service jwt
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    // mock argon2
    verifyMock = jest.spyOn(argon2, 'verify').mockResolvedValue(true);
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

    it('should return user', async () => {
      userServiceMock.getUserByUsername.mockResolvedValue(resolvedValue);

      const result = await authService.login(payload);

      expect(result).toBe(resolvedValue);
    });

    it('should call argon.verify() for check password', async () => {
      await authService.login(payload);
      expect(verifyMock).toHaveBeenCalledWith(resolvedValue.password, password);
    });

    // TODO: ajouter un check de throw error si user n'est pas trouvé 
    // TODO: ajouter un check de throw error si password est invalide
  });
});
