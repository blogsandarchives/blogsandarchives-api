import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from '~/health/health.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const addr = configService.get<string>('MONGODB_ADDR') || '127.0.0.1';
        const port = configService.get<string>('MONGODB_PORT') || 27017;

        const user =
          configService.get<string>('MONGODB_USER') || 'blogsandarchives';
        const pwd =
          configService.get<string>('MONGODB_PASSWORD') || 'blogsandarchives';

        const db =
          configService.get<string>('MONGODB_DB') || 'blogsandarchivesDB';

        return {
          uri: `mongodb://${user}:${pwd}@${addr}:${port}/${db}?authSource=admin`,
        };
      },
    }),
    UsersModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
