import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // Cambia esto a la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permite enviar cookies si es necesario
  });

  setGlobalModifiers(app);
  await app.listen(process.env.PORT);
}
bootstrap();

const setGlobalModifiers = (appModule: INestApplication) => {
  appModule.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
};
