import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  JwtPayload,
  RotateTokensData,
  TokenExtractorData,
} from './types/token.type';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); // alow get objet request
    const response = context.switchToHttp().getResponse<Response>(); // allow add cookie if refresh need on response

    const tokens: TokenExtractorData = this.extractTokenFromCookie(request); // get cookie from request

    // check if cookie is on the request
    if (!tokens.jwtCookie || !tokens.refreshTokenCookie) {
      if (!tokens.jwtCookie) {
        console.error('jwt cookie is missing on the request');
      }
      if (!tokens.refreshTokenCookie) {
        console.error('refresh cookie is missing on the request');
      }
      throw new UnauthorizedException('no tokens found');
    }

    try {
      // check jwt token success
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        tokens.jwtCookie || '',
        {
          secret: process.env.JWT_SECRET,
        },
      );

      request['user'] = payload;
      request['refresh_token'] = tokens.refreshTokenCookie;
      return true;
    } catch (error) {
      // if expiration jwtToken and refreshToken is valid
      if (error instanceof TokenExpiredError && tokens.refreshTokenCookie) {
        // generate cookie config
        const cookieConfig = this.authService.generateCookiesConfig();
        // refresh tokens (jwt and refresh)
        try {
          console.log('JWT expired. Attempting auto refresh ...');
          // we refresh tokens
          const rotateToken: RotateTokensData =
            await this.authService.rotateTokens(tokens.refreshTokenCookie);

          // update cookie on the response
          response.cookie(
            'jwt_cookie',
            rotateToken.newJwtToken,
            cookieConfig.jwtCookieConfig,
          );
          response.cookie(
            'refresh_cookie',
            rotateToken.newRefreshToken,
            cookieConfig.refreshCookieConfig,
          );

          // update request with new cookies
          request['user'] = rotateToken.user;
          request['refresh_token'] = rotateToken.newRefreshToken;

          console.log('auto-refresh successful.');
          return true;
        } catch (refreshError) {
          // if refresh failed
          console.error('Auto-refresh failed: ', refreshError);
          // clean cookie
          response.clearCookie('jwt_cookie', cookieConfig.jwtCookieConfig);
          response.clearCookie(
            'refresh_token',
            cookieConfig.refreshCookieConfig,
          );
          throw new UnauthorizedException(
            'Session expired, please login again',
          );
        }
      }

      throw new UnauthorizedException();
    }
  }

  private extractTokenFromCookie(request: Request): TokenExtractorData {
    const jwtCookie =
      (request.cookies?.['jwt_cookie'] || undefined) ?? null;
    const refreshTokenCookie =
      (request.cookies?.['refresh_cookie'] || undefined) ?? null;

    return {
      jwtCookie,
      refreshTokenCookie,
    };
  }
}
