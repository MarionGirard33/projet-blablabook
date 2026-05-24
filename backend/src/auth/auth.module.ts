import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PasswordService } from '../security/password/password.service';
import { SecurityModule } from 'src/security/security.module';

@Module({
  controllers: [AuthController],
  imports: [UserModule, SecurityModule],
  providers: [AuthService, PasswordService],
  exports: [AuthService],
})
export class AuthModule {}
