import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { APP_CONFIG, AppConfig } from '../Config/app.config';
import { User } from 'src/Entities/user.entity';
import { Company } from 'src/Entities/company.entity';
import { Screen } from 'src/Entities/screen.entity';
import { Campaign } from 'src/Entities/campaign.entity';
import { Media } from 'src/Entities/media.entity';
import { Reservation } from 'src/Entities/reservation.entity';

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
      entities: [User, Screen, Reservation, Company, Campaign, Media],
      migrationsRun: false,
      synchronize: false,
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
    };
  },
};
