import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { appConfigFactory } from './Common/Config/app.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HTTPLoggingInterceptor } from './Common/Interceptors/http-logger.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormAsyncConfig } from './Common/Config/typeorm.config';
import { UserModule } from './Modules/User/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeormAsyncConfig),
    NestConfigModule.forRoot({ load: [appConfigFactory], isGlobal: true }),
    UserModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HTTPLoggingInterceptor,
    }
  ],
})
export class AppModule {}
