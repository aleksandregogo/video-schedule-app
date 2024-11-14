import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from 'dotenv';
import * as process from 'process';

const configPath = `.env`;
config({ path: configPath });

console.log(process.env)

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_DB_HOST,
  port: 5433,
  username: process.env.PG_DB_USER,
  password: process.env.PG_DB_PASSWORD,
  database: process.env.PG_DB,
  entities: ['src/Entities/*.ts'],
  migrations: ['src/Common/Migrations/*.ts'],
  migrationsRun: true,
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});

export default dataSource;