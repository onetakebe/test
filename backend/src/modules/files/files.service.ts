import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class FilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
  ) {}

  /**
   * Registers file metadata. Binary upload/storage is delegated to an external
   * provider (e.g. Google Drive / S3) — only the resulting URL is persisted.
   */
  async upload(dto: UploadFileDto, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      select: { id: true },
    });
    if (!project) throw new NotFoundException(`Project ${dto.projectId} not found`);

    const file = await this.prisma.file.create({
      data: {
        projectId: dto.projectId,
        uploadedBy: userId,
        fileName: dto.fileName,
        fileUrl: dto.fileUrl,
        fileType: dto.fileType,
        fileSize: dto.fileSize,
      },
      include: { uploader: { select: { id: true, name: true } } },
    });

    await this.activity.log({
      userId,
      action: `uploaded file "${file.fileName}"`,
      entityType: 'project',
      entityId: dto.projectId,
      metadata: { fileId: file.id },
    });

    return file;
  }

  async findOne(id: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
      include: {
        uploader: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });
    if (!file) throw new NotFoundException(`File ${id} not found`);
    return file;
  }

  async remove(id: string, userId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
      select: { id: true, fileName: true, projectId: true },
    });
    if (!file) throw new NotFoundException(`File ${id} not found`);

    await this.prisma.file.delete({ where: { id } });
    await this.activity.log({
      userId,
      action: `deleted file "${file.fileName}"`,
      entityType: 'project',
      entityId: file.projectId,
    });
    return { success: true };
  }
}
