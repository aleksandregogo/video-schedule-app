import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './Common/Filters/http-exception.filter';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './User/user.module';
import { AuthModule } from './Auth/auth.module';
import cookieParser from 'cookie-parser';
import { ScheduleModule } from './Schedule/schedule.module';
import { LocationModule } from './Location/location.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'] });

  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors({
    origin: (process.env.ALLOWED_ORIGINS || '').split(',').map(origin => {
      if (origin.includes('*')) {
        const regexString = origin.replace(/\./g, '\\.').replace(/\*/g, '.*');
        return new RegExp(`^${regexString}$`);
      }
      return origin;
    }),
    credentials: true
  });

  createSwaggerDoc(app);

  await app.listen(process.env.APPLICATION_PORT || 3000);
}

function createSwaggerDoc(app: INestApplication<any>) {
  const options = new DocumentBuilder().setTitle('Adloop API').setVersion('1.0.0').build();
  try {
    const document = SwaggerModule.createDocument(app, options, {
      include: [
        UserModule,
        AuthModule,
        ScheduleModule,
        LocationModule
      ],
    });

    SwaggerModule.setup('docs', app, document);
  } catch (e) {
    console.log(e);
  }
}

bootstrap();
