import { TaskStatus } from '../task.model';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
