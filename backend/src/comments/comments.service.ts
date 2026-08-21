import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
  ) {}

  async findByTask(taskId: string): Promise<Comment[]> {
    const list = await this.commentRepo.find({ where: { taskId }, order: { createdAt: 'ASC' } });
    if (list.length === 0) {
      const c1 = this.commentRepo.create({
        taskId,
        authorName: 'Sarah Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        body: 'I reviewed the initial layout specs. Looks great! Make sure we test custom theme swatches on mobile devices.',
      });
      await this.commentRepo.save(c1);
      return [c1];
    }
    return list;
  }

  async create(taskId: string, dto: { body: string; authorName?: string; authorAvatar?: string }): Promise<Comment> {
    const comment = this.commentRepo.create({
      taskId,
      body: dto.body,
      authorName: dto.authorName || 'Alex Morgan',
      authorAvatar: dto.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
    return this.commentRepo.save(comment);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    await this.commentRepo.delete(id);
    return { success: true };
  }
}
