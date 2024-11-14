import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { APP_CONFIG, AppConfig } from '../Config/app.config';
import { readFileSync } from 'fs';
import { User } from 'src/Entities/user.entity';

export const TypeormAsyncConfig: TypeOrmModuleAsyncOptions = {
  inject: [APP_CONFIG],
  useFactory: async (
    appConfig: AppConfig,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: appConfig.db.host,
      port: appConfig.db.port,
      username: appConfig.db.username,
      password: appConfig.db.password,
      database: appConfig.db.database,
      // ssl: {
      //   ca: readFileSync(appConfig.db.cert),
      // },
      entities: [User],
      migrations: ['dist/Migrations/*.js'],
      migrationsRun: false,
      synchronize: false,
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
    };
  },
};
