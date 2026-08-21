import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findByTask(@Param('taskId') taskId: string) {
    return this.commentsService.findByTask(taskId);
  }

  @Post()
  async create(@Param('taskId') taskId: string, @Body() dto: { body: string; authorName?: string }) {
    return this.commentsService.create(taskId, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
