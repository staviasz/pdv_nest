import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsPositiveOrZero } from 'src/utils/validator/IsPositiveOrZero';

export class CreateProductDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositiveOrZero()
  stockAmount: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  value: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  categoryId: number;
}
