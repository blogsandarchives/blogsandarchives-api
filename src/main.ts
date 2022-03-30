import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DefaultConfigService } from './default-config.service';
import { NotFoundExceptionFilter } from './not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new NotFoundExceptionFilter());

  const defaultConfigService = app.get(DefaultConfigService);

  const addr = defaultConfigService.bindAddr;
  const port = defaultConfigService.bindPort;
  await app.listen(port, addr);
}
bootstrap();
