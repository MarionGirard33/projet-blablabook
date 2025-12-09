import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RegisterRequestDto } from './dto/register-request.dto';
import { UsersService } from 'src/users/users.service';
import argon2 from 'argon2';
import { UserInsert } from 'src/users/types/users';
import { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class AuthService {
  // injection de dépendances pour accéder aux méthodes
  constructor(private readonly userService: UsersService) {}

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
}
