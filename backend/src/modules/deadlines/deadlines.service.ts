import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDeadlineDto } from './dto/create-deadline.dto';
import { UpdateDeadlineDto } from './dto/update-deadline.dto';

@Injectable()
export class DeadlinesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.deadline.findMany({
      include: { project: { select: { id: true, name: true } } },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const deadline = await this.prisma.deadline.findUnique({
      where: { id },
      include: { project: { select: { id: true, name: true } } },
    });
    if (!deadline) throw new NotFoundException(`Deadline ${id} not found`);
    return deadline;
  }

  create(dto: CreateDeadlineDto) {
    return this.prisma.deadline.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description,
        dueDate: new Date(dto.dueDate),
        priority: dto.priority,
        status: dto.status,
      },
      include: { project: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, dto: UpdateDeadlineDto) {
    await this.findOne(id);
    return this.prisma.deadline.update({
      where: { id },
      data: {
        ...(dto.projectId !== undefined && { projectId: dto.projectId }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.dueDate !== undefined && { dueDate: new Date(dto.dueDate) }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
      include: { project: { select: { id: true, name: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.deadline.delete({ where: { id } });
    return { success: true };
  }
}
