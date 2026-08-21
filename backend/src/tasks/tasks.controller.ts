import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Query('projectId') projectId?: string, @Query('status') status?: string, @Query('search') search?: string) {
    return this.tasksService.findAll({ projectId, status, search });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  async create(@Body() dto: any) {
    return this.tasksService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.tasksService.update(id, dto);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.tasksService.updateStatus(id, status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Get(':id/activity')
  async getActivity(@Param('id') id: string) {
    return this.tasksService.getActivityLogs(id);
  }
}
