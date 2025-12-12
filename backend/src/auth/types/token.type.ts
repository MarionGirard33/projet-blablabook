import { CookieOptions } from 'express';
import { refreshToken } from 'src/db/schema';

export type TokenSelect = typeof refreshToken.$inferSelect;
export type TokenInsert = typeof refreshToken.$inferInsert;

export type JwtPayload = {
  sub: number;
  userRole: string;
};

export type TokenExtractorData = {
  jwtCookie: string | null;
  refreshTokenCookie: string | null;
};

export type CookiesConfig = {
  jwtCookieConfig: CookieOptions;
  refreshCookieConfig: CookieOptions;
};
