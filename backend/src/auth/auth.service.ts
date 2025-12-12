import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RegisterRequestDto } from './dto/register-request.dto';
import { UsersService } from 'src/users/users.service';
import argon2 from 'argon2';
import { UserInsert } from 'src/users/types/users';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import {
  CookiesConfig,
  JwtPayload,
  RotateTokensData,
  TokenInsert,
  TokenSelect,
  UserJoinRefreshToken,
} from './types/token.type';
import { db } from 'src/db';
import { refreshToken, users } from 'src/db/schema';
import { CookieOptions } from 'express';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  // injection de dépendances pour accéder aux méthodes
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // LOGIN ================================================
  async login(payload: LoginRequestDto) {
    const user = await this.userService.getUserByUsername(payload.username);
    if (!user) {
      console.error('email not found');
      throw new UnauthorizedException('invalid credentials');
    }

    let isPasswordValid: boolean;
    try {
      isPasswordValid = await argon2.verify(user.password, payload.password);
    } catch (err) {
      let errorMessage = 'failed to check the password';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error('check password is failed: ', errorMessage);
      throw new InternalServerErrorException('failed to hash password');
    }

    if (!isPasswordValid) {
      console.error('password is not valid');
      throw new UnauthorizedException('invalid credentials');
    }

    return user;
  }

  // REGISTER ====================================================================
  async register(payload: RegisterRequestDto) {
    if (payload.password !== payload.confirmPassword) {
      throw new UnprocessableEntityException('password is not confirmed');
    }

    const existingUser = await this.userService.checkUserExisting(
      payload.username,
      payload.email,
    );

    if (existingUser) {
      if (existingUser.email === payload.email) {
        throw new UnprocessableEntityException('email is already in use');
      } else if (existingUser.username === payload.username) {
        throw new UnprocessableEntityException('username is already in use');
      }
    }

    let hashedPassword: string;
    try {
      hashedPassword = await argon2.hash(payload.password);
    } catch (err: any) {
      let errorMessage = 'failed to hash password';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error('hash failed during register user', errorMessage);
      throw new InternalServerErrorException('failed to hash password');
    }

    const userInputData: UserInsert = {
      email: payload.email,
      password: hashedPassword,
      username: payload.username,
    };

    const userEntity = await this.userService.createUser(userInputData);
    if (!userEntity) {
      throw new InternalServerErrorException('failed to create new user');
    }

    // plainToInstance allow to convert response with ResponseDTO
    // with parameter excludeExtraneousMesBols, values @Exlude is not submit in the response
    return plainToInstance(RegisterResponseDto, userEntity, {
      excludeExtraneousValues: true,
    });
  }

  // COOKIE ===========================================================
  generateCookiesConfig(): CookiesConfig {
    // if we set TRUE, we need to be on HTTPS, so for the dev we use false for save the cookie
    const secureProps = process.env.NODE_ENV === 'prod';

    const jwtCookieConfig: CookieOptions = {
      httpOnly: true,
      secure: secureProps,
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15min
    };

    const refreshCookieConfig: CookieOptions = {
      httpOnly: true,
      secure: secureProps,
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day
    };

    return {
      refreshCookieConfig,
      jwtCookieConfig,
    };
  }

  // JWT token ===========================================================
  async generateJWTToken(userId: number, userRole: string) {
    const payload: JwtPayload = {
      sub: userId,
      userRole,
    };

    let jwtToken: string;
    try {
      jwtToken = await this.jwtService.signAsync(payload);
    } catch (err) {
      let errorMessage = 'failed to sign JWT token';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error('failed to sign JWT token: ', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }

    return jwtToken;
  }

  // REFRESH TOKEN ===============================
  async generateRefreshToken(userId: number): Promise<string> {
    // generate random string for the refresh token => send to front
    const tokenValue = randomBytes(32).toString('hex');

    // hash token for store in db
    // const hashedRefreshToken = await argon2.hash(refreshToken);
    const hashedRefreshToken = createHash('sha256')
      .update(tokenValue)
      .digest('hex');

    const tokenData: TokenInsert = {
      token: hashedRefreshToken,
      userId,
    };

    // store token in db
    const token = await this.storeRefreshToken(tokenData);
    if (!token) {
      console.error('Failed to store new refresh token');
      throw new InternalServerErrorException(
        'failed to store new refresh token',
      );
    }

    return tokenValue;
  }

  async storeRefreshToken(payload: TokenInsert): Promise<TokenSelect | null> {
    const result = await db.insert(refreshToken).values(payload).returning();
    return result[0] ?? null;
  }

  async destoyRefreshToken(token: string) {
    const result = await db
      .delete(refreshToken)
      .where(eq(refreshToken.token, token));
    return result || null;
  }

  async refreshToken(userId: number) {
    await db.delete(refreshToken).where(eq(refreshToken.userId, userId));
    const token = await this.generateRefreshToken(userId);
    if (!token) {
      console.error('failed to refresh the refresh token');
      throw new InternalServerErrorException('failed to refresh token');
    }
  }

  async rotateTokens(refreshToken: string): Promise<RotateTokensData> {
    // hash for find token in DB
    const hashedIncomingToken = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // find user data with the refresh token
    const userFromDb = await this.getUserByRefreshToken(hashedIncomingToken);
    //check if token is find in DB
    if (!userFromDb || !userFromDb.user) {
      throw new UnauthorizedException('invalide refresh token');
    }

    // delete old refresh token
    await this.destoyRefreshToken(hashedIncomingToken);

    const user: JwtPayload = {
      sub: userFromDb.user.id,
      userRole: userFromDb.user.role,
    };

    const newJwtToken = await this.generateJWTToken(user.sub, user.userRole);
    const newRefreshToken = await this.generateRefreshToken(user.sub);

    return {
      newJwtToken,
      newRefreshToken,
      user,
    };
  }

  async getUserByRefreshToken(
    token: string,
  ): Promise<UserJoinRefreshToken | null> {
    const result = await db
      .select()
      .from(refreshToken)
      .leftJoin(users, eq(refreshToken.userId, users.id))
      .where(eq(refreshToken.token, token));
    return result[0] ?? null;
  }
}
