import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DefaultConfigService } from './default-config.service';
import { HealthController } from './health/health.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [AppModule],
      inject: [DefaultConfigService],
      useFactory: (defaultConfigService: DefaultConfigService) => {
        const addr = defaultConfigService.mongoDbAddr;
        const port = defaultConfigService.mongoDbPort;

        const user = defaultConfigService.mongoDbUser;
        const password = defaultConfigService.mongoDbPassword;

        const db = defaultConfigService.mongoDbDb;
        const authSource = defaultConfigService.mongoDbAuthSrc;

        return {
          uri: `mongodb://${user}:${password}@${addr}:${port}/${db}?authSource=${authSource}`,
        };
      },
    }),
    UsersModule,
  ],
  controllers: [HealthController],
  providers: [DefaultConfigService],
  exports: [DefaultConfigService],
})
export class AppModule {}
