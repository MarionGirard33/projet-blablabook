import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; // import par défaut
import { Server } from 'http';
import { AuthGuard } from './auth.guard';
import { LoginResponseDto } from './dto/login-response.dto';

// FONCTION HELPER
const makePostRequest = <T = any>(
  app: INestApplication,
  endpoint: string,
  codeHttp: number,
  payload?: T,
) => {
  const req = request(app.getHttpServer() as Server).post(endpoint);
  // si des données sont envoyé sur ce endpoint, on les passe dans la requête
  if (payload) {
    req.send(payload);
  }
  // on test le code http retourner
  req.expect(codeHttp);
  return req; // on retourne la req pour chainer les vérif dans le test
};

describe('AuthController', () => {
  let app: INestApplication;

  const authService = {
    login: jest.fn<Promise<LoginResponseDto>, [any]>(),
    register: jest.fn(),
    logout: jest.fn(),
    generateJWTToken: jest.fn(),
    generateRefreshToken: jest.fn(),
    generateCookiesConfig: jest.fn(),
    destroyRefreshToken: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /auth/login', () => {
    // PREPARATION
    const id = 1;
    const email = 'giz@mail.com';
    const username = 'giz';
    const role = 'USER';
    const image = 'https://randomuser.me/api/portraits/lego/0.jpg';

    const payload: LoginResponseDto = {
      id,
      email,
      username,
      role,
      image,
    };

    // mock des fonctions utiliser
    authService.login.mockResolvedValue(payload); // mock de la réponse du authService
    authService.generateJWTToken.mockResolvedValue('mock-jwt-token');
    authService.generateRefreshToken.mockResolvedValue('mock-refresh-token');
    authService.generateCookiesConfig.mockReturnValue({
      jwtCookieConfig: { httpOnly: true, secure: false },
      refreshCookieConfig: { httpOnly: true, secure: false },
    });

    // TEST
    it('should call authService.login with correct payload', async () => {
      await makePostRequest(app, '/auth/login', 200, payload);
      expect(authService.login).toHaveBeenCalledWith(payload);
    });

    it('should return 401 if login fails', async () => {
      const { UnauthorizedException } = require('@nestjs/common');
      authService.login.mockRejectedValueOnce(new UnauthorizedException('username or password is invalid'));
      await makePostRequest(app, '/auth/login', 401, payload).expect((res) => {
        expect(res.body.message).toBe('username or password is invalid');
      });
    });

    it('should return 500 if internal error', async () => {
      const { InternalServerErrorException } = require('@nestjs/common');
      authService.login.mockRejectedValueOnce(new InternalServerErrorException('internal error'));
      await makePostRequest(app, '/auth/login', 500, payload).expect((res) => {
        expect(res.body.message).toBe('internal error');
      });
    });

    it('should return code 200', async () => {
      return makePostRequest(app, '/auth/login', 200, payload);
    });

    it('should return public user fields', async () => {
      return makePostRequest(app, '/auth/login', 200, payload).expect((res) => {
        // check qu'on retourne uniquement les champs définis dans le test
        expect(res.body).toEqual({
          id: expect.any(Number),
          email: expect.any(String),
          username: expect.any(String),
          role: expect.any(String),
          image: expect.anything(),
        });
      });
    });

    it('should send jwt_cookie and refresh_cookie with HttpOnly flag', async () => {
      await makePostRequest(app, '/auth/login', 200, payload).expect((res) => {
        const setCookieHeader = res.headers['set-cookie'];
        expect(Array.isArray(setCookieHeader)).toBe(true);
        expect(setCookieHeader.length).toBe(2);

        // Vérifie chaque cookie individuellement
        const jwtCookie = setCookieHeader.find((c) => c.startsWith('jwt_cookie='));
        const refreshCookie = setCookieHeader.find((c) => c.startsWith('refresh_cookie='));

        expect(jwtCookie).toContain('jwt_cookie=mock-jwt-token');
        expect(jwtCookie).toContain('HttpOnly');
        expect(refreshCookie).toContain('refresh_cookie=mock-refresh-token');
        expect(refreshCookie).toContain('HttpOnly');
      });
    });
  });

  describe('POST /auth/register', () => {
    const payload = {
      email: 'gizmo@mail.com',
      username: 'gizmo',
      password: '12345678',
      confirmPassword: '12345678',
    };

    const responseBody = {
      id: 1,
      email: payload.email,
      username: payload.username,
      role: 'USER',
      image: null,
    };

    it('should return 201 and user data if register is successful', async () => {
      authService.register.mockResolvedValue(responseBody);
      await makePostRequest(app, '/auth/register', 201, payload).expect(
        (res) => {
          expect(res.body).toEqual(responseBody);
        },
      );
    });

    it('should return 422 if password is not confirmed', async () => {
      const { UnprocessableEntityException } = require('@nestjs/common');
      authService.register.mockRejectedValue(
        new UnprocessableEntityException('password is not confirmed'),
      );
      await makePostRequest(app, '/auth/register', 422, {
        ...payload,
        confirmPassword: 'wrong',
      }).expect((res) => {
        expect(res.body.message).toBe('password is not confirmed');
      });
    });

    it('should return 422 if email already exists', async () => {
      const { UnprocessableEntityException } = require('@nestjs/common');
      authService.register.mockRejectedValue(
        new UnprocessableEntityException('email is already in use'),
      );
      await makePostRequest(app, '/auth/register', 422, payload).expect((res) => {
          expect(res.body.message).toBe('email is already in use');
        },
      );
    });

    it('should return 422 if username already exists', async () => {
      const { UnprocessableEntityException } = require('@nestjs/common');
      authService.register.mockRejectedValue(
        new UnprocessableEntityException('username is already in use'),
      );
      await makePostRequest(app, '/auth/register', 422, payload).expect((res) => {
          expect(res.body.message).toBe('username is already in use');
        },
      );
    });

    it('should return 500 if password hash fails', async () => {
      const { InternalServerErrorException } = require('@nestjs/common');
      authService.register.mockRejectedValue(
        new InternalServerErrorException('failed to hash password'),
      );
      await makePostRequest(app, '/auth/register', 500, payload).expect((res) => {
          expect(res.body.message).toBe('failed to hash password');
        },
      );
    });

    it('should return 500 if user is not created', async () => {
      const { InternalServerErrorException } = require('@nestjs/common');
      authService.register.mockRejectedValue(
        new InternalServerErrorException('failed to create new user'),
      );
      await makePostRequest(app, '/auth/register', 500, payload).expect((res) => {
          expect(res.body.message).toBe('failed to create new user');
        },
      );
    });
  });

  describe('POST /auth/logout', () => {
    it('should clear cookies and return success message', async () => {
      // Mock le service
      authService.destroyRefreshToken = jest.fn().mockResolvedValue(true);
      authService.generateCookiesConfig = jest.fn().mockReturnValue({
        jwtCookieConfig: { httpOnly: true, secure: false },
        refreshCookieConfig: { httpOnly: true, secure: false },
      });

      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', ['refresh_cookie=mock-refresh-token'])
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ message: 'Logged out successfully' });
          // Vérifie que les cookies sont bien clear
          const setCookieHeader = res.headers['set-cookie'];
          expect(Array.isArray(setCookieHeader)).toBe(true);
          expect(setCookieHeader.some((c) => c.startsWith('jwt_cookie=') && c.includes('Expires'))).toBe(true);
          expect(setCookieHeader.some((c) => c.startsWith('refresh_cookie=') && c.includes('Expires'))).toBe(true);
        });
    });

    it('should warn if refresh token not found but still clear cookies', async () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      authService.destroyRefreshToken = jest.fn().mockResolvedValue(false);
      authService.generateCookiesConfig = jest.fn().mockReturnValue({
        jwtCookieConfig: { httpOnly: true, secure: false },
        refreshCookieConfig: { httpOnly: true, secure: false },
      });

      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', ['refresh_cookie=mock-refresh-token'])
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ message: 'Logged out successfully' });
          expect(spy).toHaveBeenCalledWith('refresh token not found in the db');
        });
      spy.mockRestore();
    });

    it('should return 403 if not authenticated', async () => {
      // Simule le guard qui refuse l'accès
      mockAuthGuard.canActivate.mockReturnValueOnce(false);
      await request(app.getHttpServer()).post('/auth/logout').expect(403);
    });
  });
});
