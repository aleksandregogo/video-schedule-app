import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModule as NestConfigModule } from '@nestjs/config';
import { appConfigFactory } from './Common/Config/app.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HTTPLoggingInterceptor } from './Common/Interceptors/http-logger.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormAsyncConfig } from './Common/DB/typeorm.config';
import { UserModule } from './User/user.module';
import { AuthModule } from './Auth/auth.module';
import { AppService } from './app.service';
import { StorageModule } from './Storage/storage.module';
import { ScheduleModule } from './Schedule/schedule.module';
import { LocationModule } from './Location/location.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeormAsyncConfig),
    NestConfigModule.forRoot({ load: [appConfigFactory], isGlobal: true }),
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    ScheduleModule,
    StorageModule,
    LocationModule
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HTTPLoggingInterceptor,
    }
  ],
})
export class AppModule {}
