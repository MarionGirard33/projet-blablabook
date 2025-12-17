import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
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
  // TOOD: add doc swagger
  async login(@Body() payload: LoginRequestDto): Promise<LoginResponseDto> {
    // TODO: ajouter les cookie refreshToken & JWTToken sur la response
    return this.authService.login(payload);
  }
}
