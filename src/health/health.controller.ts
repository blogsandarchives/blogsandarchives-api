import { Controller, Get, HttpStatus } from '@nestjs/common';
import { genRes } from '~/response.helper';

@Controller('health')
export class HealthController {
  @Get()
  get() {
    return genRes(true, HttpStatus.OK, {
      api: 'up',
    });
  }
}
