import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

const EVENT_INCLUDE = {
  project: { select: { id: true, name: true } },
  client: { select: { id: true, name: true } },
  creator: { select: { id: true, name: true } },
} as const;

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(from?: string, to?: string) {
    return this.prisma.calendarEvent.findMany({
      where: {
        ...(from && { startDate: { gte: new Date(from) } }),
        ...(to && { endDate: { lte: new Date(to) } }),
      },
      include: EVENT_INCLUDE,
      orderBy: { startDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.calendarEvent.findUnique({
      where: { id },
      include: EVENT_INCLUDE,
    });
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  create(dto: CreateEventDto, userId: string) {
    return this.prisma.calendarEvent.create({
      data: {
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        type: dto.type,
        projectId: dto.projectId,
        clientId: dto.clientId,
        location: dto.location,
        createdBy: userId,
      },
      include: EVENT_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateEventDto) {
    await this.findOne(id);
    return this.prisma.calendarEvent.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.startDate !== undefined && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate !== undefined && { endDate: new Date(dto.endDate) }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.projectId !== undefined && { projectId: dto.projectId }),
        ...(dto.clientId !== undefined && { clientId: dto.clientId }),
        ...(dto.location !== undefined && { location: dto.location }),
      },
      include: EVENT_INCLUDE,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.calendarEvent.delete({ where: { id } });
    return { success: true };
  }
}
