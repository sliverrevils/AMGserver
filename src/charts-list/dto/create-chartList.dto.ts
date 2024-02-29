import { IsNotEmpty } from 'class-validator';

export class CreateChartListDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  charts: string;

  descriptions: string;
}
