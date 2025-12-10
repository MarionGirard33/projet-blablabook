import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  // controllers => définis le fichier qui gère les requêtes
  controllers: [AuthController],
  // imports => permet d'importer le module externe qui doit etre export pour rendre dispo ses méthodes dans le module auth
  imports: [UsersModule],
  // définis la classe contenant les méthode de service
  providers: [AuthService],
  // rend l'auth disponible pour d'autre module qui l'importe
  exports: [AuthService],
})
export class AuthModule {}
