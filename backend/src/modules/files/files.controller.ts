import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/jwt-payload.type';
import { UploadFileDto } from './dto/upload-file.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  upload(@Body() dto: UploadFileDto, @CurrentUser() user: AuthenticatedUser) {
    return this.filesService.upload(dto, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.filesService.remove(id, user.id);
  }
}
