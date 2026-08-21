import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';

@Controller('tasks/:taskId/subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Get()
  async findByTask(@Param('taskId') taskId: string) {
    return this.subtasksService.findByTask(taskId);
  }

  @Post()
  async create(@Param('taskId') taskId: string, @Body() dto: any) {
    return this.subtasksService.create(taskId, dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.subtasksService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.subtasksService.remove(id);
  }
}
