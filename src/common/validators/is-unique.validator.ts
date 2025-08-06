import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args: any) {
    const [entityClass, column] = args.constraints;
    const repo = this.dataSource.getRepository(entityClass);
    const exists = await repo.findOne({ where: { [column]: value } });
    return !exists;
  }

  defaultMessage(args: any) {
    const [, column] = args.constraints;
    return `${column} already exists`;
  }
}

export function IsUnique(
  entity: any,
  column: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, column],
      validator: IsUniqueConstraint,
    });
  };
}
