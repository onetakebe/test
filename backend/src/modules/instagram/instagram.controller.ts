import { Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { InstagramService } from './instagram.service';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @Get('metrics')
  findMetrics(@Query('clientId') clientId?: string) {
    return this.instagramService.findMetrics(clientId);
  }

  @Post('sync')
  sync() {
    return this.instagramService.sync();
  }

  @Get('top-performing')
  topPerforming(@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    return this.instagramService.topPerforming(limit);
  }

  @Get('needs-improvement')
  needsImprovement(@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    return this.instagramService.needsImprovement(limit);
  }
}
