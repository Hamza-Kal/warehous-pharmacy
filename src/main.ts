import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/errors/all.http.exceptions';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import jwtModule from './shared/jwt/jwt.module';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Makhzan')
    .setDescription('makhzan api docs')
    .setVersion('1.0')
    .addTag('makhzan')
    .build();
  const options = {
    deepScanRoutes: true,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(parseInt(process.env.PORT) || 3000, () => {
    console.log(`running on port ${process.env.PORT || 3000}`);
  });
}
bootstrap();
