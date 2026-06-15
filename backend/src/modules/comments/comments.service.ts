import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AuthenticatedUser } from '../../common/types/jwt-payload.type';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommentDto, user: AuthenticatedUser) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      select: { id: true, name: true, createdBy: true },
    });
    if (!project) throw new NotFoundException(`Project ${dto.projectId} not found`);

    const comment = await this.prisma.comment.create({
      data: {
        projectId: dto.projectId,
        taskId: dto.taskId,
        userId: user.id,
        content: dto.content,
      },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });

    await this.notifyProjectParticipants(project.id, project.name, project.createdBy, user, comment.id);

    return comment;
  }

  async update(id: string, dto: UpdateCommentDto, user: AuthenticatedUser) {
    const existing = await this.getOrThrow(id);
    this.assertCanModify(existing.userId, user);

    return this.prisma.comment.update({
      where: { id },
      data: { content: dto.content },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }

  async remove(id: string, user: AuthenticatedUser) {
    const existing = await this.getOrThrow(id);
    this.assertCanModify(existing.userId, user);

    await this.prisma.comment.delete({ where: { id } });
    return { success: true };
  }

  /**
   * Notifies everyone involved in the project (creator, task assignees and
   * previous commenters) except the author of the new comment.
   */
  private async notifyProjectParticipants(
    projectId: string,
    projectName: string,
    projectCreator: string,
    author: AuthenticatedUser,
    commentId: string,
  ) {
    const [assignees, commenters] = await Promise.all([
      this.prisma.task.findMany({
        where: { projectId, assignedTo: { not: null } },
        select: { assignedTo: true },
        distinct: ['assignedTo'],
      }),
      this.prisma.comment.findMany({
        where: { projectId, id: { not: commentId } },
        select: { userId: true },
        distinct: ['userId'],
      }),
    ]);

    const participantIds = new Set<string>([
      projectCreator,
      ...assignees.map((a) => a.assignedTo as string),
      ...commenters.map((c) => c.userId),
    ]);
    participantIds.delete(author.id);

    if (participantIds.size === 0) return;

    await this.prisma.notification.createMany({
      data: Array.from(participantIds).map((userId) => ({
        userId,
        title: 'New Comment',
        message: `${author.name} commented on "${projectName}"`,
        type: 'comment',
        actionUrl: `/projects/${projectId}`,
      })),
    });
  }

  private async getOrThrow(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!comment) throw new NotFoundException(`Comment ${id} not found`);
    return comment;
  }

  private assertCanModify(ownerId: string, user: AuthenticatedUser) {
    if (ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only modify your own comments');
    }
  }
}
