import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { isCompletelyName } from 'src/utils/validator/IsCompletelyName';
import { IsNotDigitAndSpecialChar } from 'src/utils/validator/IsNotDigitAndSpecialChar';
import { IsValidPassword } from 'src/utils/validator/IsValidPassword';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @IsNotDigitAndSpecialChar()
  @isCompletelyName()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsValidPassword()
  password: string;
}
