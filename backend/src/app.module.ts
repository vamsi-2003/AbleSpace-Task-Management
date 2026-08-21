import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PreferencesModule } from './preferences/preferences.module';
import { TasksModule } from './tasks/tasks.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { CommentsModule } from './comments/comments.module';
import { ProjectsModule } from './projects/projects.module';

import { User } from './entities/user.entity';
import { UserPreference } from './entities/user-preference.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { Subtask } from './entities/subtask.entity';
import { Comment } from './entities/comment.entity';
import { ActivityLog } from './entities/activity-log.entity';
import { Label } from './entities/label.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [User, UserPreference, Project, Task, Subtask, Comment, ActivityLog, Label],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PreferencesModule,
    TasksModule,
    SubtasksModule,
    CommentsModule,
    ProjectsModule,
  ],
})
export class AppModule {}
