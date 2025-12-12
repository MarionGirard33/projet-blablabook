import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import {
  ApiCreatedResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from './auth.guard';

@ApiTags('auth') // annotation swagger => permet de grouper la classe sous l'étiquette auth dans la documentation
@UseInterceptors(ClassSerializerInterceptor) // permet de gérer l'exclude du DTO response => retirer les field avec @Exclude dans le dto de reponse
@Controller('auth') // permet de définir le endpoint pour la classe à /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {} // injection des dépendances. Permet d'utiliser les méthodes du service

  @Post('/register') // l'endpoint complet est auth/register
  // décorateur Swagger => permet de documenter l'api
  @ApiCreatedResponse({
    // définis le code réponse (201)
    description: 'User is created with password hashed.', // message afficher dans la doc ?
    type: RegisterResponseDto, // permet de fournir le schema des données dans la doc
  })
  // why
  @ApiUnprocessableEntityResponse({
    description: 'email or username is alrady in use',
  })
  // body() permet de transmettre les données issue du body de la requête au service
  async register(
    @Body() payload: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    // on retourne directement l'objt retourner par la méthode register du service
    return this.authService.register(payload);
  }

  @Post('/login')
  // par défaut Nest utilise 201 par défaut sur les post
  // HttpCode permet de définir son propre code statut
  @HttpCode(HttpStatus.OK)
  // TODO: add doc swagger
  async login(
    @Body() payload: LoginRequestDto,
    // passthrough allow use cookie and return it
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    // get user if credentials is valid
    const user = await this.authService.login(payload);

    // generate jwt token and refresh token
    const jwtToken = await this.authService.generateJWTToken(
      user.id,
      user.role,
    );
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    // config and add cookie to response
    const cookieConfig = this.authService.generateCookiesConfig();
    response.cookie('jwt_cookie', jwtToken, cookieConfig.jwtCookieConfig);
    response.cookie(
      'refresh_cookie',
      refreshToken,
      cookieConfig.refreshCookieConfig,
    );

    // return response with user data
    return plainToInstance(LoginResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // TODO: add doc for swagger
  @Post('/logout')
  @UseGuards(AuthGuard) // add the guard for extract cookie
  @HttpCode(HttpStatus.OK) // code 200 for the logout if success
  async logout(
    @Req() request: Request, // allow to use request objet
    @Res({ passthrough: true }) response: Response,
  ) {
    // get refresh token from request with guard
    const refreshToken = request['refresh_token'] as string;
    // delete refresh token
    const isDestoyToken =
      await this.authService.destoyRefreshToken(refreshToken);

    if (!isDestoyToken) {
      console.warn('refresh token not found in the db');
    }

    // generate config config for clear to the front
    const cookieConfig = this.authService.generateCookiesConfig();
    // destroy jwt and refresh cookie
    response.clearCookie('jwt_cookie', cookieConfig.jwtCookieConfig);
    response.clearCookie('refresh_cookie', cookieConfig.refreshCookieConfig);

    return { message: 'Logged out successfully' };
  }
}
