import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import { HttpExceptionFilter } from '~/http-exception.filter';
import { ErrorFilter } from '~/error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);

  await app.listen(
    parseInt(configService.get<string>('HOST_PORT')) || 8080,
    configService.get<string>('HOST_ADDR') || '127.0.0.1',
  );
}
bootstrap();
