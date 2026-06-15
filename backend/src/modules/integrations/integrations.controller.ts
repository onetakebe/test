import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/types/jwt-payload.type';
import { ConnectIntegrationDto } from './dto/connect-integration.dto';
import { IntegrationsService } from './integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  findAll() {
    return this.integrationsService.findAll();
  }

  @Get(':provider/status')
  status(@Param('provider') provider: string) {
    return this.integrationsService.status(provider);
  }

  @Roles(UserRole.ADMIN)
  @Post(':provider/connect')
  connect(
    @Param('provider') provider: string,
    @Body() dto: ConnectIntegrationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.integrationsService.connect(provider, dto, user.id);
  }

  @Roles(UserRole.ADMIN)
  @Post(':provider/disconnect')
  disconnect(@Param('provider') provider: string) {
    return this.integrationsService.disconnect(provider);
  }

  @Post(':provider/sync')
  sync(@Param('provider') provider: string) {
    return this.integrationsService.sync(provider);
  }
}
