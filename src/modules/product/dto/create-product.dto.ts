import { Type } from 'class-transformer';
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
  @Type(() => Number)
  stockAmount: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  value: number;

  @IsOptional()
  image?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  categoryId: number;
}
