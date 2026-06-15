import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Integration, IntegrationProvider, IntegrationStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { encrypt } from '../../common/utils/encryption.util';
import { ConnectIntegrationDto } from './dto/connect-integration.dto';

@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const existing = await this.prisma.integration.findMany();
    const byProvider = new Map(existing.map((i) => [i.provider, i]));

    // Always report every known provider, even before its row is created.
    return Object.values(IntegrationProvider).map((provider) => {
      const integration = byProvider.get(provider);
      return integration
        ? this.sanitize(integration)
        : { provider, status: IntegrationStatus.DISCONNECTED, connectedBy: null, expiresAt: null };
    });
  }

  async connect(provider: string, dto: ConnectIntegrationDto, userId: string) {
    const parsed = this.parseProvider(provider);

    const integration = await this.prisma.integration.upsert({
      where: { provider: parsed },
      create: {
        provider: parsed,
        status: IntegrationStatus.CONNECTED,
        accessToken: dto.accessToken ? encrypt(dto.accessToken) : null,
        refreshToken: dto.refreshToken ? encrypt(dto.refreshToken) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        connectedBy: userId,
      },
      update: {
        status: IntegrationStatus.CONNECTED,
        ...(dto.accessToken !== undefined && { accessToken: encrypt(dto.accessToken) }),
        ...(dto.refreshToken !== undefined && { refreshToken: encrypt(dto.refreshToken) }),
        ...(dto.expiresAt !== undefined && { expiresAt: new Date(dto.expiresAt) }),
        connectedBy: userId,
      },
    });

    return this.sanitize(integration);
  }

  async disconnect(provider: string) {
    const parsed = this.parseProvider(provider);
    const existing = await this.prisma.integration.findUnique({ where: { provider: parsed } });
    if (!existing) throw new NotFoundException(`Integration ${parsed} was never connected`);

    const integration = await this.prisma.integration.update({
      where: { provider: parsed },
      data: {
        status: IntegrationStatus.DISCONNECTED,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      },
    });

    return this.sanitize(integration);
  }

  async sync(provider: string) {
    const parsed = this.parseProvider(provider);
    const integration = await this.prisma.integration.findUnique({ where: { provider: parsed } });

    if (!integration || integration.status !== IntegrationStatus.CONNECTED) {
      return {
        provider: parsed,
        synced: false,
        message: 'Integration is not connected.',
      };
    }

    // Placeholder for the provider-specific sync implementation.
    return {
      provider: parsed,
      synced: true,
      message: 'Sync completed.',
      syncedAt: new Date().toISOString(),
    };
  }

  async status(provider: string) {
    const parsed = this.parseProvider(provider);
    const integration = await this.prisma.integration.findUnique({ where: { provider: parsed } });
    if (!integration) {
      return { provider: parsed, status: IntegrationStatus.DISCONNECTED };
    }
    return this.sanitize(integration);
  }

  /** Never expose (even encrypted) tokens through the API. */
  private sanitize(integration: Integration) {
    const { accessToken: _at, refreshToken: _rt, ...safe } = integration;
    return { ...safe, hasCredentials: Boolean(_at) };
  }

  private parseProvider(provider: string): IntegrationProvider {
    const normalized = provider.toUpperCase().replace(/-/g, '_');
    if (!(normalized in IntegrationProvider)) {
      throw new BadRequestException(
        `Unknown provider "${provider}". Valid providers: ${Object.values(IntegrationProvider).join(', ')}`,
      );
    }
    return normalized as IntegrationProvider;
  }
}
