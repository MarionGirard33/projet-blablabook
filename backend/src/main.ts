import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add ValidationPipe for use dto validator
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // retire les champs non définis
      forbidNonWhitelisted: true, // return error if field unknow is send
    }),
  );

  // add documentation with swagger
  const config = new DocumentBuilder()
    .setTitle('BlablaBook')
    .setDescription('The BlablaBook API description')
    .setVersion('1.0')
    .addTag('blablabooks')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
