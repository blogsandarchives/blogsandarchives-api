import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DefaultConfigService {
  constructor(private configService: ConfigService) {}

  get bindAddr(): string {
    return this.configService.get('BIND_ADDR') || '0.0.0.0';
  }

  get bindPort(): number {
    return parseInt(this.configService.get('BIND_PORT')) || 80;
  }

  get mongoDbAddr(): string {
    return this.configService.get('MONGODB_ADDR') || '127.0.0.1';
  }

  get mongoDbPort(): number {
    return parseInt(this.configService.get('MONGODB_PORT')) || 27017;
  }

  get mongoDbUser(): string {
    return this.configService.get('MONGODB_USER') || 'blogsandarchives';
  }

  get mongoDbPassword(): string {
    return this.configService.get('MONGODB_PASSWORD') || 'blogsandarchives';
  }

  get mongoDbDb(): string {
    return this.configService.get('MONGODB_DB') || 'blogsandarchives';
  }

  get mongoDbAuthSrc(): string {
    return this.configService.get('MONGODB_AUTH_SRC') || 'admin';
  }
}
