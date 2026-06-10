import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/jwt-payload.type';
import { AiService } from './ai.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ProjectSummaryDto } from './dto/project-summary.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('project-summary')
  projectSummary(@Body() dto: ProjectSummaryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.aiService.projectSummary(dto.projectId, user.id);
  }

  @Post('weekly-summary')
  weeklySummary(@CurrentUser() user: AuthenticatedUser) {
    return this.aiService.weeklySummary(user.id);
  }

  @Post('task-priority')
  taskPriority(@CurrentUser() user: AuthenticatedUser) {
    return this.aiService.taskPriority(user.id);
  }

  @Post('instagram-analysis')
  instagramAnalysis(@CurrentUser() user: AuthenticatedUser) {
    return this.aiService.instagramAnalysis(user.id);
  }

  @Post('generate-report')
  generateReport(@Body() dto: GenerateReportDto, @CurrentUser() user: AuthenticatedUser) {
    return this.aiService.generateReport(dto.period ?? 'weekly', dto.focus, user.id);
  }

  @Get('summaries')
  findSummaries(@Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number) {
    return this.aiService.findSummaries(limit);
  }
}
