import { PipeTransform, BadRequestException } from '@nestjs/common';
import { Validator } from 'class-validator';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  transform(value: any) {
    const valueInUpperCase = value.toUpperCase();

    if (!this.isStatusValid(valueInUpperCase)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }

    return valueInUpperCase;
  }

  private isStatusValid(status: any) {
    const validator = new Validator();
    return validator.isEnum(status, TaskStatus);
  }
}
