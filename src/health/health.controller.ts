import { Controller, Get, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { genRes } from '~/helpers/response.helper';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private conn: Connection) {}

  @Get()
  checkHealth() {
    return genRes(true, HttpStatus.OK, {
      api: 'up',
      db: this.conn.readyState === 1 ? 'up' : 'down',
    });
  }
}
