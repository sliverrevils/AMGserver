import { IsNotEmpty } from 'class-validator';

export class DirectSelectedListsDto {
  readonly name: string;

  readonly selectedStats: string;

  readonly blankRows: string;
}
