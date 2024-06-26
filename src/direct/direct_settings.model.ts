import { Model, Table, Column } from 'sequelize-typescript';

@Table
export class DirectSettings extends Model {
  @Column
  columns: string;

  @Column
  cacheStatsLogics: string;
}
