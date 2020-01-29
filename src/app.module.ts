import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => (
        config.get<TypeOrmModuleOptions>('typeOrm')
      ),
      inject: [ConfigService],
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
