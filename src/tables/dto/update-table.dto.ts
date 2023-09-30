import { IsNotEmpty } from 'class-validator';

export class UpdateTableDto {
  @IsNotEmpty()
  readonly columns: string;

  @IsNotEmpty()
  readonly costumLines: string;
}
