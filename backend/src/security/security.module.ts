import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CookieService } from './cookie/cookie.service';
import { TokenRepository } from './token/token.respository';
import { TokenService } from './token/token.service';
import { AuthGuard } from '../auth/auth.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [CookieService, TokenService, TokenRepository, AuthGuard],
  exports: [CookieService, TokenService, TokenRepository, AuthGuard],
})
export class SecurityModule {}
