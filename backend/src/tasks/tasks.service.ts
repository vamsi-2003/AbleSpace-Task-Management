import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Task } from '../entities/task.entity';
import { ActivityLog } from '../entities/activity-log.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @InjectRepository(ActivityLog)
    private activityRepo: Repository<ActivityLog>,
  ) {}

  async findAll(query?: { projectId?: string; status?: string; search?: string }): Promise<Task[]> {
    const where: any = {};
    if (query?.projectId) where.projectId = query.projectId;
    if (query?.status) where.status = query.status;
    if (query?.search) {
      return this.taskRepo.find({
        where: [
          { title: Like(`%${query.search}%`) },
          { description: Like(`%${query.search}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
    }

    const tasks = await this.taskRepo.find({ order: { createdAt: 'DESC' } });
    if (tasks.length === 0) {
      await this.seedInitialTasks();
      return this.taskRepo.find({ order: { createdAt: 'DESC' } });
    }
    return tasks;
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  async create(dto: Partial<Task>): Promise<Task> {
    const task = this.taskRepo.create({
      status: 'ToDo',
      priority: 'NoPriority',
      assignees: ['Alex Morgan'],
      labels: ['Design'],
      ...dto,
    });
    const saved = await this.taskRepo.save(task);
    await this.logActivity(saved.id, `created task "${saved.title}"`);
    return saved;
  }

  async update(id: string, dto: Partial<Task>): Promise<Task> {
    const task = await this.findOne(id);
    const oldPriority = task.priority;
    const oldStatus = task.status;

    Object.assign(task, dto);
    const updated = await this.taskRepo.save(task);

    if (dto.priority && dto.priority !== oldPriority) {
      await this.logActivity(id, `changed priority from ${oldPriority} to ${dto.priority}`);
    }
    if (dto.status && dto.status !== oldStatus) {
      await this.logActivity(id, `moved status from ${oldStatus} to ${dto.status}`);
    }

    return updated;
  }

  async updateStatus(id: string, status: string): Promise<Task> {
    const task = await this.findOne(id);
    const oldStatus = task.status;
    task.status = status;
    const updated = await this.taskRepo.save(task);
    await this.logActivity(id, `moved status from ${oldStatus} to ${status}`);
    return updated;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const task = await this.findOne(id);
    await this.taskRepo.remove(task);
    return { success: true };
  }

  async getActivityLogs(taskId: string): Promise<ActivityLog[]> {
    return this.activityRepo.find({ where: { taskId }, order: { createdAt: 'DESC' } });
  }

  private async logActivity(taskId: string, action: string) {
    const log = this.activityRepo.create({
      taskId,
      userName: 'You',
      action,
    });
    await this.activityRepo.save(log);
  }

  private async seedInitialTasks() {
    const seeds: Partial<Task>[] = [
      {
        title: 'Review Task Requirements',
        description: 'Review project guidelines, user stories, and acceptance criteria.',
        status: 'ToDo',
        priority: 'Medium',
        dueDate: '2026-08-20',
        reporterName: 'Alex Morgan',
        projectName: 'Pyramid Workspace',
        assignees: ['Alex Morgan'],
        labels: ['Planning'],
        teams: ['Product Team'],
      },
      {
        title: 'Develop User Interface',
        description: 'Build responsive components, Kanban drag-and-drop, and list views.',
        status: 'Doing',
        priority: 'High',
        dueDate: '2026-08-18',
        reporterName: 'Alex Morgan',
        projectName: 'Pyramid Workspace',
        assignees: ['Sarah Chen'],
        labels: ['Frontend'],
        teams: ['Dev Team'],
      },
      {
        title: 'Project Setup & Config',
        description: 'Initialize Next.js frontend, NestJS backend, and SQLite database.',
        status: 'Completed',
        priority: 'Low',
        dueDate: '2026-08-12',
        reporterName: 'Alex Morgan',
        projectName: 'Pyramid Workspace',
        assignees: ['David Kim'],
        labels: ['Setup'],
        teams: ['Core Devs'],
      },
      {
        title: 'Future Enhancements',
        description: 'Plan optional third-party integrations and analytics extensions.',
        status: 'OnHold',
        priority: 'NoPriority',
        dueDate: '2026-09-01',
        reporterName: 'Alex Morgan',
        projectName: 'Pyramid Workspace',
        assignees: ['Elena Rostova'],
        labels: ['Research'],
        teams: ['Product Team'],
      },
    ];

    for (const seed of seeds) {
      const t = this.taskRepo.create(seed);
      const saved = await this.taskRepo.save(t);
      await this.logActivity(saved.id, `posted task "${saved.title}"`);
    }
  }
}
