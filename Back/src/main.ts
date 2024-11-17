import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './Common/Filters/http-exception.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './User/user.module';
import { AuthModule } from './Auth/auth.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(origin => {
    if (origin.includes('*')) {
      const regexString = origin.replace(/\./g, '\\.').replace(/\*/g, '.*');
      return new RegExp(`^${regexString}$`);
    }
    return origin;
  });

  app.enableCors({
    origin: allowedOrigins,
    credentials: true
  });

  const options = new DocumentBuilder().setTitle('Gateway API').setVersion('1.0').addBearerAuth().build();
  try {
    const document = SwaggerModule.createDocument(app, options, {
      include: [
        UserModule,
        AuthModule
      ],
    });

    SwaggerModule.setup('docs', app, document);
  } catch (e) {
    console.log(e);
  }

  await app.listen(process.env.APPLICATION_PORT || 3000);
}
bootstrap();
