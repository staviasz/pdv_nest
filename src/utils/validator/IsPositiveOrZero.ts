import {
  Validate,
  ValidationOptions,
  ValidatorConstraint,
} from 'class-validator';

@ValidatorConstraint({
  name: 'IsPositiveOrZero',
  async: false,
})
export class IsPositiveOrZeroConstraint {
  validate(value: number) {
    return value >= 0;
  }
  defaultMessage(validationArguments?: any) {
    return `${validationArguments.property} must be positive or zero`;
  }
}

export function IsPositiveOrZero(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, property: string) {
    Validate(IsPositiveOrZeroConstraint, validationOptions)(object, property);
  };
}
