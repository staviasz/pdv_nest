import {
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cpf as CPF } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'IsValidCpf', async: true })
export class IsValidCpfConstraint implements ValidatorConstraintInterface {
  validate(cpf: string) {
    if (!CPF.isValid(cpf)) {
      return false;
    }
    return true;
  }

  defaultMessage() {
    return 'Invalid Cpf';
  }
}

export function IsValidCpf(validationOptions?: any) {
  return function (object: Record<string, any>, propertyName: string) {
    Validate(IsValidCpfConstraint, validationOptions)(object, propertyName);
  };
}
