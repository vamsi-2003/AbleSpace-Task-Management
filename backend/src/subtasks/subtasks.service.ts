import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subtask } from '../entities/subtask.entity';

@Injectable()
export class SubtasksService {
  constructor(
    @InjectRepository(Subtask)
    private subtaskRepo: Repository<Subtask>,
  ) {}

  async findByTask(taskId: string): Promise<Subtask[]> {
    const list = await this.subtaskRepo.find({ where: { taskId }, order: { createdAt: 'ASC' } });
    if (list.length === 0) {
      // Seed default subtasks for demonstration
      const s1 = this.subtaskRepo.create({
        taskId,
        title: 'Review existing UI component spec',
        completed: true,
        priority: 'Medium',
        assigneeName: 'Alex Morgan',
      });
      const s2 = this.subtaskRepo.create({
        taskId,
        title: 'Implement responsive breakpoints & dark mode styles',
        completed: false,
        priority: 'High',
        assigneeName: 'Sarah Chen',
      });
      await this.subtaskRepo.save([s1, s2]);
      return [s1, s2];
    }
    return list;
  }

  async create(taskId: string, dto: Partial<Subtask>): Promise<Subtask> {
    const subtask = this.subtaskRepo.create({
      taskId,
      title: dto.title || 'New Subtask',
      completed: dto.completed ?? false,
      priority: dto.priority || 'Medium',
      assigneeName: dto.assigneeName || 'Alex Morgan',
      dueDate: dto.dueDate || '2026-08-30',
    });
    return this.subtaskRepo.save(subtask);
  }

  async update(id: string, dto: Partial<Subtask>): Promise<Subtask> {
    const subtask = await this.subtaskRepo.findOne({ where: { id } });
    if (!subtask) throw new NotFoundException(`Subtask ${id} not found`);
    Object.assign(subtask, dto);
    return this.subtaskRepo.save(subtask);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    await this.subtaskRepo.delete(id);
    return { success: true };
  }
}
