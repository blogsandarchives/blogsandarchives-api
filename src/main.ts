import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const addr = configService.get<string>('BIND_ADDR') || '0.0.0.0';
  const port = parseInt(configService.get('BIND_PORT')) || 80;
  await app.listen(port, addr);
}
bootstrap();
