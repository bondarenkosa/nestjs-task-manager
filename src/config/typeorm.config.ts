import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'db/database.db',
  synchronize: true,
  logging: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};
