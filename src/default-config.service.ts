import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { argon2d, argon2i, argon2id } from 'argon2';

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

  get argon2Type(): 0 | 1 | 2 {
    const typeStr = this.configService.get('ARGON2_TYPE') || 'argon2id';
    switch (typeStr) {
      case 'argon2d':
        return argon2d;
      case 'argon2i':
        return argon2i;
      case 'argon2id':
        return argon2id;
    }
  }

  get argon2Iter(): number {
    return parseInt(this.configService.get('ARGON2_ITER')) || 3;
  }

  get argon2P(): number {
    return parseInt(this.configService.get('ARGON2_P')) || 4;
  }

  get argon2Mem(): number {
    return parseInt(this.configService.get('ARGON2_MEM')) || 65536;
  }

  get argon2SaltLen(): number {
    return parseInt(this.configService.get('ARGON2_SALT_LEN')) || 16;
  }

  get argon2TagLen(): number {
    return parseInt(this.configService.get('ARGON2_TAG_LEN')) || 32;
  }
}
