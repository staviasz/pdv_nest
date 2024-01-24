import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsNotDigitAndSpecialChar } from 'src/utils/validator/IsNotDigitAndSpecialChar';

export class CreateCategoryDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  @IsNotDigitAndSpecialChar()
  name: string;
}
