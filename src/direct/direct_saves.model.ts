import { Model, Table, Column } from 'sequelize-typescript';

@Table
export class DirectSaves extends Model {
  @Column
  columns: string;

  @Column
  cacheStatsLogics: string;

  @Column
  info: string;
  @Column
  members: string;
  @Column
  tabels: string;
}
