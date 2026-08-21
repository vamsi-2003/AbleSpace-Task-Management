import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    const projects = await this.projectRepo.find({ order: { createdAt: 'DESC' } });
    if (projects.length === 0) {
      const p1 = this.projectRepo.create({
        name: 'Mobile App Redesign',
        priority: 'High',
        leadName: 'Alex Morgan',
        dueDate: '2026-09-15',
        workspaceName: 'Pyramid Workspace',
      });
      const p2 = this.projectRepo.create({
        name: 'Backend Infrastructure',
        priority: 'Urgent',
        leadName: 'David Kim',
        dueDate: '2026-08-30',
        workspaceName: 'Pyramid Workspace',
      });
      const p3 = this.projectRepo.create({
        name: 'QA Automation',
        priority: 'Medium',
        leadName: 'Elena Rostova',
        dueDate: '2026-10-01',
        workspaceName: 'Pyramid Workspace',
      });
      await this.projectRepo.save([p1, p2, p3]);
      return [p1, p2, p3];
    }
    return projects;
  }

  async create(dto: Partial<Project>): Promise<Project> {
    const proj = this.projectRepo.create({
      name: dto.name || 'New Project',
      priority: dto.priority || 'Medium',
      leadName: dto.leadName || 'Alex Morgan',
      dueDate: dto.dueDate || '2026-09-30',
      workspaceName: 'Pyramid Workspace',
    });
    return this.projectRepo.save(proj);
  }
}
