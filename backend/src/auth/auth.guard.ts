import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, TokenExtractorData } from './types/token.type';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); // alow get objet request
    const tokens: TokenExtractorData = this.extractTokenFromCookie(request); // get cookie from request

    if (!tokens.jwtCookie || !tokens.refreshTokenCookie) {
      if (!tokens.jwtCookie) {
        console.error('jwt cookie is missing on the request');
      }
      if (!tokens.refreshTokenCookie) {
        console.error('refresh cookie is missing on the request');
      }
      throw new UnauthorizedException();
    }

    request['refresh_token'] = tokens.refreshTokenCookie;

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        tokens.jwtCookie,
        {
          secret: process.env.JWT_SECRET,
        },
      );

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): TokenExtractorData {
    const jwtCookie =
      ((request.cookies?.['jwt_cookie'] as string) || undefined) ?? null;
    const refreshTokenCookie =
      ((request.cookies?.['refresh_cookie'] as string) || undefined) ?? null;

    return {
      jwtCookie,
      refreshTokenCookie,
    };
  }
}
