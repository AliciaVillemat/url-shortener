import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get('health')
  getHealth(): { status: 'ok' } {
    return { status: 'ok' };
  }
}
