import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './module/app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');

  app.enableCors(
    {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization',
    }
  
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application listening in port: http://localhost${port}`);
}
bootstrap();
