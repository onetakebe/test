import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { AssignTaskDto } from './dto/assign-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

const TASK_INCLUDE = {
  project: { select: { id: true, name: true } },
  assignee: { select: { id: true, name: true, avatarUrl: true } },
} as const;

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
  ) {}

  findAll() {
    return this.prisma.task.findMany({ include: TASK_INCLUDE, orderBy: { dueDate: 'asc' } });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        ...TASK_INCLUDE,
        comments: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async create(dto: CreateTaskDto, userId: string) {
    const task = await this.prisma.task.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description,
        assignedTo: dto.assignedTo,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        completedAt: dto.status === TaskStatus.COMPLETED ? new Date() : undefined,
        createdBy: userId,
      },
      include: TASK_INCLUDE,
    });

    await this.activity.log({
      userId,
      action: `created task "${task.title}"`,
      entityType: 'task',
      entityId: task.id,
    });

    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    const existing = await this.getOrThrow(id);

    const statusChanged = dto.status !== undefined && dto.status !== existing.status;
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.projectId !== undefined && { projectId: dto.projectId }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.assignedTo !== undefined && { assignedTo: dto.assignedTo }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.dueDate !== undefined && { dueDate: new Date(dto.dueDate) }),
        ...(statusChanged && {
          completedAt: dto.status === TaskStatus.COMPLETED ? new Date() : null,
        }),
      },
      include: TASK_INCLUDE,
    });

    if (statusChanged) {
      await this.logStatusChange(userId, id, existing.status, dto.status as TaskStatus);
    }

    return task;
  }

  async updateStatus(id: string, dto: UpdateTaskStatusDto, userId: string) {
    const existing = await this.getOrThrow(id);

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        status: dto.status,
        completedAt: dto.status === TaskStatus.COMPLETED ? new Date() : null,
      },
      include: TASK_INCLUDE,
    });

    if (existing.status !== dto.status) {
      await this.logStatusChange(userId, id, existing.status, dto.status);
    }

    return task;
  }

  async assign(id: string, dto: AssignTaskDto, userId: string) {
    await this.getOrThrow(id);

    const task = await this.prisma.task.update({
      where: { id },
      data: { assignedTo: dto.assignedTo ?? null },
      include: TASK_INCLUDE,
    });

    await this.activity.log({
      userId,
      action: task.assignee
        ? `assigned task "${task.title}" to ${task.assignee.name}`
        : `unassigned task "${task.title}"`,
      entityType: 'task',
      entityId: id,
      metadata: { assignedTo: dto.assignedTo ?? null },
    });

    return task;
  }

  async remove(id: string, userId: string) {
    const existing = await this.getOrThrow(id);
    await this.prisma.task.delete({ where: { id } });
    await this.activity.log({
      userId,
      action: `deleted task "${existing.title}"`,
      entityType: 'task',
      entityId: id,
    });
    return { success: true };
  }

  private async getOrThrow(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select: { id: true, title: true, status: true },
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  private logStatusChange(userId: string, taskId: string, from: TaskStatus, to: TaskStatus) {
    return this.activity.log({
      userId,
      action: `changed task status from ${from} to ${to}`,
      entityType: 'task',
      entityId: taskId,
      metadata: { from, to },
    });
  }
}
