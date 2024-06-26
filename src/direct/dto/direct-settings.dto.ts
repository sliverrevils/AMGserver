import { IsNotEmpty } from 'class-validator';

export class DirectSettingsDto {
  readonly columns: string;

  readonly cacheStatsLogics: string;
}
