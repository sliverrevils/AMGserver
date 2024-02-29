import { IsNotEmpty } from 'class-validator';

export class CreateTableStatisticDto {
  @IsNotEmpty()
  readonly tableName: string;
  readonly dateStart: number;
  readonly dateEnd: number;
  readonly headers: string;
  readonly rows: string;
  readonly tableDescriptions: string;
  readonly tableDescriptionsName: string;
  readonly columnsWidth: string;
  readonly dateColumn: string;
  readonly about: string;
}
