import { Injectable } from '@nestjs/common';
import { IntegrationProvider, IntegrationStatus, PerformanceStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class InstagramService {
  constructor(private readonly prisma: PrismaService) {}

  findMetrics(clientId?: string) {
    return this.prisma.instagramMetrics.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { postDate: 'desc' },
    });
  }

  /**
   * Placeholder for the Instagram/Meta Graph API sync. When the INSTAGRAM_META
   * integration is connected, this is where post insights would be fetched and
   * upserted. For now it just reports the connection state.
   */
  async sync() {
    const integration = await this.prisma.integration.findUnique({
      where: { provider: IntegrationProvider.INSTAGRAM_META },
    });

    if (!integration || integration.status !== IntegrationStatus.CONNECTED) {
      return {
        synced: false,
        message: 'Instagram/Meta integration is not connected. Connect it on the Integrations page first.',
      };
    }

    const count = await this.prisma.instagramMetrics.count();
    return {
      synced: true,
      message: `Sync placeholder executed. ${count} posts currently tracked.`,
      syncedAt: new Date().toISOString(),
    };
  }

  topPerforming(limit = 10) {
    return this.prisma.instagramMetrics.findMany({
      where: { performanceStatus: PerformanceStatus.TOP_PERFORMING },
      include: { client: { select: { id: true, name: true } } },
      orderBy: { engagementRate: 'desc' },
      take: limit,
    });
  }

  needsImprovement(limit = 10) {
    return this.prisma.instagramMetrics.findMany({
      where: { performanceStatus: PerformanceStatus.NEEDS_IMPROVEMENT },
      include: { client: { select: { id: true, name: true } } },
      orderBy: { engagementRate: 'asc' },
      take: limit,
    });
  }
}
