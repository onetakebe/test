import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProjectStatus, TaskStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  // ──────────────────────────── Public API ────────────────────────────

  async projectSummary(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: { select: { name: true } },
        tasks: { select: { title: true, status: true, dueDate: true, priority: true } },
        deadlines: { select: { title: true, dueDate: true, status: true } },
      },
    });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);

    const openTasks = project.tasks.filter((t) => t.status !== TaskStatus.COMPLETED);
    const context =
      `Project "${project.name}" for client ${project.client.name}. ` +
      `Status: ${project.status}, progress ${project.progress}%, deadline ${project.deadline?.toISOString().slice(0, 10) ?? 'not set'}. ` +
      `${openTasks.length} of ${project.tasks.length} tasks still open.`;

    const mock =
      `${project.name} (${project.client.name}) is ${project.progress}% complete and currently in status ${project.status}. ` +
      `${openTasks.length} of ${project.tasks.length} tasks remain open` +
      (openTasks.length > 0
        ? `, including "${openTasks[0].title}" (${openTasks[0].priority}). `
        : '. ') +
      (project.deadline
        ? `The deadline is ${project.deadline.toISOString().slice(0, 10)} — recommended focus is closing the highest-priority open tasks first so review and approval can happen with buffer before delivery.`
        : `No deadline is set yet — recommend agreeing on one with the client to anchor the production schedule.`);

    const content = await this.generate(
      `You are a production assistant for a marketing & audiovisual studio. Write a concise project status summary with risks and a clear recommendation.\n\n${context}`,
      mock,
    );

    return this.persist('project-summary', content, userId, projectId);
  }

  async weeklySummary(userId: string) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86_400_000);

    const [activeProjects, completedTasks, openTasks, lateTasks] = await Promise.all([
      this.prisma.project.count({
        where: { status: { notIn: [ProjectStatus.DELIVERED, ProjectStatus.FINISHED] } },
      }),
      this.prisma.task.count({
        where: { status: TaskStatus.COMPLETED, completedAt: { gte: weekAgo } },
      }),
      this.prisma.task.count({ where: { status: { not: TaskStatus.COMPLETED } } }),
      this.prisma.task.count({
        where: { status: { not: TaskStatus.COMPLETED }, dueDate: { lt: now } },
      }),
    ]);

    const context = `This week: ${activeProjects} active projects, ${completedTasks} tasks completed in the last 7 days, ${openTasks} tasks still open, ${lateTasks} tasks overdue.`;
    const mock =
      `Weekly summary: the team is running ${activeProjects} active projects and completed ${completedTasks} tasks in the last 7 days. ` +
      `${openTasks} tasks remain open, of which ${lateTasks} are overdue` +
      (lateTasks > 0
        ? ' — clearing the overdue items should be the first priority next week to protect upcoming deliveries.'
        : ' — the pipeline is healthy, so next week can focus on advancing in-flight productions.');

    const content = await this.generate(
      `You are a production assistant. Write a short weekly summary for the team with one actionable recommendation.\n\n${context}`,
      mock,
    );

    return this.persist('weekly-summary', content, userId);
  }

  async taskPriority(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { status: { not: TaskStatus.COMPLETED } },
      include: {
        project: { select: { name: true } },
        assignee: { select: { name: true } },
      },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
      take: 10,
    });

    const lines = tasks.map(
      (t, i) =>
        `${i + 1}. "${t.title}" (${t.project.name}) — ${t.priority}, due ${t.dueDate?.toISOString().slice(0, 10) ?? 'no date'}${t.assignee ? `, assigned to ${t.assignee.name}` : ''}`,
    );

    const mock =
      tasks.length === 0
        ? 'No open tasks right now — the board is clear.'
        : `Suggested execution order based on priority and due dates:\n${lines.join('\n')}\n\nStart with the top item: it has the tightest combination of priority and deadline, and unblocks downstream work.`;

    const content = await this.generate(
      `You are a production assistant. Given these open tasks, suggest an execution order with brief reasoning.\n\n${lines.join('\n')}`,
      mock,
    );

    return this.persist('task-priority', content, userId);
  }

  async instagramAnalysis(userId: string) {
    const posts = await this.prisma.instagramMetrics.findMany({
      include: { client: { select: { name: true } } },
      orderBy: { engagementRate: 'desc' },
    });

    const top = posts[0];
    const bottom = posts[posts.length - 1];
    const avg =
      posts.length > 0
        ? Math.round((posts.reduce((s, p) => s + p.engagementRate, 0) / posts.length) * 100) / 100
        : 0;

    const context = posts
      .map(
        (p) =>
          `"${p.postName}" (${p.client?.name ?? 'unknown client'}, ${p.postType}): ${p.views} views, ${p.likes} likes, ${p.engagementRate}% engagement, ${p.performanceStatus}`,
      )
      .join('\n');

    const mock =
      posts.length === 0
        ? 'No Instagram metrics tracked yet. Connect the Instagram/Meta integration and sync to start analyzing performance.'
        : `Instagram analysis across ${posts.length} tracked posts (avg engagement ${avg}%):\n\n` +
          `Top performer: "${top.postName}" at ${top.engagementRate}% engagement with ${top.views.toLocaleString()} views — ${top.postType} content is clearly resonating.\n` +
          `Weakest: "${bottom.postName}" at ${bottom.engagementRate}% — consider reworking the hook or republishing as a Reel.\n\n` +
          `Recommendation: shift more of the content mix toward the formats driving top performance, and A/B test captions on underperforming accounts.`;

    const content = await this.generate(
      `You are a social media analyst. Analyze these Instagram post metrics and give 2-3 concrete recommendations.\n\n${context}`,
      mock,
    );

    return this.persist('instagram-analysis', content, userId);
  }

  async generateReport(period: 'weekly' | 'monthly', focus: string | undefined, userId: string) {
    const days = period === 'monthly' ? 30 : 7;
    const since = new Date(Date.now() - days * 86_400_000);

    const [projects, completedTasks, newClients, igTotals] = await Promise.all([
      this.prisma.project.findMany({
        select: { name: true, status: true, progress: true },
        orderBy: { updatedAt: 'desc' },
        take: 8,
      }),
      this.prisma.task.count({
        where: { status: TaskStatus.COMPLETED, completedAt: { gte: since } },
      }),
      this.prisma.client.count({ where: { createdAt: { gte: since } } }),
      this.prisma.instagramMetrics.aggregate({
        _sum: { views: true },
        _avg: { engagementRate: true },
      }),
    ]);

    const projectLines = projects
      .map((p) => `- ${p.name}: ${p.status}, ${p.progress}%`)
      .join('\n');

    const mock =
      `${period === 'monthly' ? 'Monthly' : 'Weekly'} report${focus ? ` (focus: ${focus})` : ''}\n\n` +
      `Production:\n${projectLines || '- No projects yet'}\n\n` +
      `Throughput: ${completedTasks} tasks completed in the last ${days} days. ${newClients} new clients added.\n` +
      `Social: ${(igTotals._sum.views ?? 0).toLocaleString()} total tracked views, average engagement ${Math.round((igTotals._avg.engagementRate ?? 0) * 100) / 100}%.\n\n` +
      `Outlook: keep momentum on in-flight projects and convert top-performing social formats into repeatable playbooks.`;

    const content = await this.generate(
      `You are a production assistant. Write a ${period} report for a marketing & audiovisual studio${focus ? ` focusing on ${focus}` : ''}.\n\nProjects:\n${projectLines}\nTasks completed (${days}d): ${completedTasks}\nNew clients: ${newClients}`,
      mock,
    );

    return this.persist(`${period}-report`, content, userId);
  }

  findSummaries(limit = 50) {
    return this.prisma.aISummary.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // ──────────────────────────── Internals ────────────────────────────

  /**
   * Calls the OpenAI chat completions API when OPENAI_API_KEY is configured.
   * Falls back to a realistic mocked summary otherwise (or on API failure),
   * so the API works out of the box in development.
   */
  private async generate(prompt: string, mock: string): Promise<string> {
    const apiKey = this.config.get<string>('openaiApiKey');
    if (!apiKey) return mock;

    try {
      const response = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 600,
          temperature: 0.6,
        }),
      });

      if (!response.ok) {
        this.logger.warn(`OpenAI API returned ${response.status}; using mocked summary`);
        return mock;
      }

      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      return data.choices?.[0]?.message?.content?.trim() || mock;
    } catch (error) {
      this.logger.warn(`OpenAI request failed (${(error as Error).message}); using mocked summary`);
      return mock;
    }
  }

  private async persist(type: string, content: string, userId: string, projectId?: string) {
    return this.prisma.aISummary.create({
      data: {
        type,
        content,
        generatedBy: userId,
        relatedProjectId: projectId,
      },
    });
  }
}
