import { Injectable } from '@nestjs/common';
import { ProjectStatus, TaskStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async overview() {
    const now = new Date();
    const [
      projectsInProgress,
      projectsCompleted,
      openTasks,
      completedTasks,
      lateTasks,
      unreadNotifications,
      latestSnapshot,
    ] = await Promise.all([
      this.prisma.project.count({
        where: { status: { notIn: [ProjectStatus.DELIVERED, ProjectStatus.FINISHED] } },
      }),
      this.prisma.project.count({
        where: { status: { in: [ProjectStatus.DELIVERED, ProjectStatus.FINISHED] } },
      }),
      this.prisma.task.count({ where: { status: { not: TaskStatus.COMPLETED } } }),
      this.prisma.task.count({ where: { status: TaskStatus.COMPLETED } }),
      this.prisma.task.count({
        where: { status: { not: TaskStatus.COMPLETED }, dueDate: { lt: now } },
      }),
      this.prisma.notification.count({ where: { isRead: false } }),
      this.prisma.metrics.findFirst({ orderBy: { createdAt: 'desc' } }),
    ]);

    const totalTasks = openTasks + completedTasks;
    return {
      projectsInProgress,
      projectsCompleted,
      openTasks,
      completedTasks,
      lateTasks,
      unreadNotifications,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      avgDeliveryTime: latestSnapshot?.avgDeliveryTime ?? null,
      clientSatisfaction: latestSnapshot?.clientSatisfaction ?? null,
      revenueImpact: latestSnapshot?.revenueImpact ?? null,
    };
  }

  async projects() {
    const [byStatus, byPriority, avgProgress] = await Promise.all([
      this.prisma.project.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.project.groupBy({ by: ['priority'], _count: { _all: true } }),
      this.prisma.project.aggregate({ _avg: { progress: true } }),
    ]);

    return {
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
      byPriority: byPriority.map((p) => ({ priority: p.priority, count: p._count._all })),
      avgProgress: Math.round(avgProgress._avg.progress ?? 0),
    };
  }

  async tasks() {
    const now = new Date();
    const [byStatus, byPriority, late, completedTasks] = await Promise.all([
      this.prisma.task.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.task.groupBy({ by: ['priority'], _count: { _all: true } }),
      this.prisma.task.count({
        where: { status: { not: TaskStatus.COMPLETED }, dueDate: { lt: now } },
      }),
      this.prisma.task.findMany({
        where: { status: TaskStatus.COMPLETED, completedAt: { not: null } },
        select: { createdAt: true, completedAt: true },
      }),
    ]);

    const avgCompletionDays =
      completedTasks.length > 0
        ? completedTasks.reduce(
            (sum, t) =>
              sum + ((t.completedAt as Date).getTime() - t.createdAt.getTime()) / 86_400_000,
            0,
          ) / completedTasks.length
        : 0;

    return {
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
      byPriority: byPriority.map((p) => ({ priority: p.priority, count: p._count._all })),
      lateTasks: late,
      avgCompletionDays: Math.round(avgCompletionDays * 10) / 10,
    };
  }

  async instagram() {
    const [totals, byStatus, topPosts] = await Promise.all([
      this.prisma.instagramMetrics.aggregate({
        _sum: { views: true, likes: true, comments: true, shares: true, saves: true },
        _avg: { engagementRate: true },
        _count: { _all: true },
      }),
      this.prisma.instagramMetrics.groupBy({
        by: ['performanceStatus'],
        _count: { _all: true },
      }),
      this.prisma.instagramMetrics.findMany({
        orderBy: { engagementRate: 'desc' },
        take: 5,
        include: { client: { select: { id: true, name: true } } },
      }),
    ]);

    return {
      totalPosts: totals._count._all,
      totalViews: totals._sum.views ?? 0,
      totalLikes: totals._sum.likes ?? 0,
      totalComments: totals._sum.comments ?? 0,
      totalShares: totals._sum.shares ?? 0,
      totalSaves: totals._sum.saves ?? 0,
      avgEngagementRate: Math.round((totals._avg.engagementRate ?? 0) * 100) / 100,
      byPerformanceStatus: byStatus.map((s) => ({
        status: s.performanceStatus,
        count: s._count._all,
      })),
      topPosts,
    };
  }

  async team() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        assignedTasks: {
          select: { status: true, dueDate: true, completedAt: true },
        },
      },
    });

    return users.map((u) => {
      const total = u.assignedTasks.length;
      const completed = u.assignedTasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
      const onTime = u.assignedTasks.filter(
        (t) =>
          t.status === TaskStatus.COMPLETED &&
          (!t.dueDate || (t.completedAt && t.completedAt <= t.dueDate)),
      ).length;

      return {
        id: u.id,
        name: u.name,
        avatarUrl: u.avatarUrl,
        role: u.role,
        totalTasks: total,
        completedTasks: completed,
        onTimeTasks: onTime,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  }
}
