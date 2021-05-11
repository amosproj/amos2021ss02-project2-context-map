import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsUrl = process.env.CORS_URL;

  if (corsUrl) {
    app.enableCors({
      origin: corsUrl,
    });
    Logger.log(`Cors enabled for ${corsUrl}`);
  } else {
    Logger.log('Cors not enabled');
  }

  await app.listen(8080);
}

bootstrap();
