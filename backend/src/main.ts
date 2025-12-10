import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enabled CORS
  app.enableCors({
    // origin: process.env.FRONTEND_URL_CORS,
    origin: 'http://localhost:5173', //TODO: passer sur la variable .env
    credentials: true,
  });

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

// best practice
bootstrap().catch((err) => {
  console.error('Fatal error during application bootstrap: ', err);
  // exit programme with failed error if failed
  process.exit(1);
});
