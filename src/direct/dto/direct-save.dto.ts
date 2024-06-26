import { IsNotEmpty } from 'class-validator';

export class DirectSaveDto {
  readonly columns: string;

  readonly cacheStatsLogics: string;

  readonly info: string;

  readonly members: string;

  readonly tabels: string;
}
