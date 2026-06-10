import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
  ) {}

  findAll() {
    return this.prisma.project.findMany({
      include: {
        client: { select: { id: true, name: true, companyName: true } },
        _count: { select: { tasks: true, comments: true, files: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        creator: { select: { id: true, name: true, avatarUrl: true } },
        deadlines: { orderBy: { dueDate: 'asc' } },
        _count: { select: { tasks: true, comments: true, files: true } },
      },
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async create(dto: CreateProjectDto, userId: string) {
    const project = await this.prisma.project.create({
      data: {
        clientId: dto.clientId,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        status: dto.status,
        priority: dto.priority,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        progress: dto.progress ?? 0,
        coverImageUrl: dto.coverImageUrl,
        createdBy: userId,
      },
      include: { client: { select: { id: true, name: true } } },
    });

    await this.activity.log({
      userId,
      action: `created project "${project.name}"`,
      entityType: 'project',
      entityId: project.id,
    });

    return project;
  }

  async update(id: string, dto: UpdateProjectDto, userId: string) {
    const existing = await this.prisma.project.findUnique({
      where: { id },
      select: { id: true, name: true, status: true },
    });
    if (!existing) throw new NotFoundException(`Project ${id} not found`);

    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.clientId !== undefined && { clientId: dto.clientId }),
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.startDate !== undefined && { startDate: new Date(dto.startDate) }),
        ...(dto.deadline !== undefined && { deadline: new Date(dto.deadline) }),
        ...(dto.progress !== undefined && { progress: dto.progress }),
        ...(dto.coverImageUrl !== undefined && { coverImageUrl: dto.coverImageUrl }),
      },
      include: { client: { select: { id: true, name: true } } },
    });

    if (dto.status !== undefined && dto.status !== existing.status) {
      await this.activity.log({
        userId,
        action: `changed project status from ${existing.status} to ${dto.status}`,
        entityType: 'project',
        entityId: id,
        metadata: { from: existing.status, to: dto.status },
      });
    }

    return project;
  }

  async remove(id: string, userId: string) {
    const existing = await this.prisma.project.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
    if (!existing) throw new NotFoundException(`Project ${id} not found`);

    await this.prisma.project.delete({ where: { id } });
    await this.activity.log({
      userId,
      action: `deleted project "${existing.name}"`,
      entityType: 'project',
      entityId: id,
    });
    return { success: true };
  }

  async findTasks(id: string) {
    await this.ensureExists(id);
    return this.prisma.task.findMany({
      where: { projectId: id },
      include: { assignee: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findComments(id: string) {
    await this.ensureExists(id);
    return this.prisma.comment.findMany({
      where: { projectId: id },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFiles(id: string) {
    await this.ensureExists(id);
    return this.prisma.file.findMany({
      where: { projectId: id },
      include: { uploader: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActivity(id: string) {
    await this.ensureExists(id);
    return this.activity.findByProject(id);
  }

  private async ensureExists(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id }, select: { id: true } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
  }
}
