import { IsNotEmpty } from 'class-validator';

export class CreateTableDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly view_pattern_id: number;

  @IsNotEmpty()
  readonly columns: string;
}
