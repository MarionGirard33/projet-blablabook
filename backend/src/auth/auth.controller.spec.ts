import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; // import par défaut
import { Server } from 'http';
import { AuthGuard } from './auth.guard';

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
    login: jest.fn(),
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

    const payload = {
      id,
      email,
      username,
      role,
      image,
    };

    // mock des fonctions utiliser
    authService.login.mockResolvedValue(payload);
    authService.generateJWTToken.mockResolvedValue('mock-jwt-token');
    authService.generateRefreshToken.mockResolvedValue('mock-refresh-token');
    authService.generateCookiesConfig.mockReturnValue({
      jwtCookieConfig: { httpOnly: true, secure: false },
      refreshCookieConfig: { httpOnly: true, secure: false },
    });

    it('should return code 200', async () => {
      return makePostRequest(app, '/auth/login', 200, payload);
    });

    it('should return user data', async () => {
      return makePostRequest(app, '/auth/login', 200, payload).expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('username');
        expect(res.body).toHaveProperty('role');
        expect(res.body).toHaveProperty('image');
      });
    });

    it("souldn't return password, createdAt, updatedAt", async () => {
      return makePostRequest(app, '/auth/login', 200, payload).expect((res) => {
        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('createdAt');
        expect(res.body).not.toHaveProperty('updatedAt');
        expect(res.body).not.toHaveProperty('deletedAt');
      });
    });

    it('should send jwt_cookie and refresh_token', async () => {
      return makePostRequest(app, '/auth/login', 200, payload).expect((res) => {
        // TODO: revoir ce test
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

    // it('should exist and return 200', async () => {
    //   authService.login.mockResolvedValue({
    //     accessToken: 'token',
    //     user: { id: 1, email: 'test@test.com' },
    //   });

    //   return request(app.getHttpServer() as Server)
    //     .post('/auth/login')
    //     .send({ email: 'test@test.com', password: '12345678' })
    //     .expect(200)
    //     .expect((res: { body: LoginResponse }) => {
    //       expect(res.body).toHaveProperty('accessToken');
    //       expect(res.body).toHaveProperty('user');
    //       expect(res.body.user.email).toBe('test@test.com');
    //     });
    // });
  });
});
