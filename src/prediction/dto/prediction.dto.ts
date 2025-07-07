import { IsNotEmpty, IsNumber } from 'class-validator';

export class PredictionDto {
  @IsNotEmpty()
  @IsNumber()
  rice_quantity: number;

  @IsNotEmpty()
  @IsNumber()
  day_of_week: number;

  @IsNotEmpty()
  @IsNumber()
  month: number;

  @IsNotEmpty()
  @IsNumber()
  hour: number;

  @IsNotEmpty()
  @IsNumber()
  minute: number;

  @IsNotEmpty()
  @IsNumber()
  meal_type_encoded: number;
}
