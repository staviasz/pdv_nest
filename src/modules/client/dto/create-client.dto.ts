import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { isCompletelyName } from 'src/utils/validator/IsCompletelyName';
import { IsNotDigitAndSpecialChar } from 'src/utils/validator/IsNotDigitAndSpecialChar';
import { IsValidCpf } from 'src/utils/validator/IsValidCpf';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @IsNotDigitAndSpecialChar()
  @isCompletelyName()
  @MinLength(8)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  @IsNumberString()
  @IsValidCpf()
  cpf: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(8)
  @IsNumberString()
  cep?: string;

  @IsString()
  @IsOptional()
  @IsNumberString()
  number?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  district?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;
}
