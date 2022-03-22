import { Controller, Get } from '@nestjs/common';
import { genRes } from '~/helpers/response.helper';

@Controller('/health')
export class HealthController {
  @Get()
  checkHealth() {
    return genRes(true, 200, { api: 'up' });
  }
}
