import { Controller, Get, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { genRes } from '~/response.helper';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private mongoDbConn: Connection) {}

  @Get()
  get() {
    return genRes(true, HttpStatus.OK, {
      api: 'up',
      mongodb: this.mongoDbConn.readyState === 1 ? 'up' : 'down',
    });
  }
}
