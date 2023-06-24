import { IsNotEmpty } from 'class-validator';

export class CreateStatisticDto {
  @IsNotEmpty()
  readonly dateStart: string;

  @IsNotEmpty()
  readonly dateEnd: string;

  @IsNotEmpty()
  readonly fields: string;

  @IsNotEmpty()
  readonly created_by: number;

  readonly updated_by: number;

  @IsNotEmpty()
  readonly chart_id: number;

  readonly descriptions: string;
}
