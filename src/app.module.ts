import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const addr = configService.get('MONGODB_ADDR') || '127.0.0.1';
        const port = parseInt(configService.get('MONGODB_PORT')) || 27017;

        const user = configService.get('MONGODB_USER') || 'blogsandarchives';
        const password =
          configService.get('MONGODB_PASSWORD') || 'blogsandarchives';

        const db = configService.get('MONGODB_DB') || 'blogsandarchives';
        const authSource = configService.get('MONGODB_AUTH_SRC') || 'admin';

        return {
          uri: `mongodb://${user}:${password}@${addr}:${port}/${db}?authSource=${authSource}`,
        };
      },
    }),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
