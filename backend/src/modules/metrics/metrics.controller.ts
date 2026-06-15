import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('overview')
  overview() {
    return this.metricsService.overview();
  }

  @Get('projects')
  projects() {
    return this.metricsService.projects();
  }

  @Get('tasks')
  tasks() {
    return this.metricsService.tasks();
  }

  @Get('instagram')
  instagram() {
    return this.metricsService.instagram();
  }

  @Get('team')
  team() {
    return this.metricsService.team();
  }
}
