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

    it('should return code 200', async () => {
      return makePostRequest(app, '/auth/login', 200, payload);
    });

    it('should return public user fields', async () => {
      return makePostRequest(app, '/auth/login', 200, payload).expect((res) => {
        // check qu'on retourne uniquement les champs définis dans le test
        expect(res.body).toEqual({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(Number),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          email: expect.any(String),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          username: expect.any(String),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          role: expect.any(String),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          image: expect.anything(),
        });
      });
    });

    // TODO: revoir le test du cookie
    it('should send jwt_cookie and refresh_token', async () => {
      return makePostRequest(app, '/auth/login', 200, payload).expect((res) => {
        const setCookieHeader = res.headers['set-cookie'];
        expect(Array.isArray(setCookieHeader)).toBe(true);
        // Expect exactly two cookies to be set
        expect(setCookieHeader.length).toBe(2);

        const cookiesString = setCookieHeader.join(';');
        // Check cookie names and values
        expect(cookiesString).toContain('jwt_cookie=mock-jwt-token');
        expect(cookiesString).toContain('refresh_cookie=mock-refresh-token');
        // Basic flags check from mocked config
        expect(cookiesString).toContain('HttpOnly');
      });
    });
  });
});
