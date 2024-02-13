import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // Валидируем данные
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    // Если ошибок нет
    if (errors.length === 0) {
      return value;
    }

    // Форматируем ошибки
    const formatErrors = this.formatError(errors);

    throw new HttpException(
      { errors: formatErrors },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  formatError(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      return {
        ...acc,
        [error.property]: Object.values(error.constraints),
      };
    }, {});
  }
}
