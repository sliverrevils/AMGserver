import { Model, Table, Column } from 'sequelize-typescript';

@Table
export class Statistic extends Model {
  @Column
  dateStart: string;

  @Column
  dateEnd: string;

  @Column({ defaultValue: `[]` })
  fields: string;

  @Column
  created_by: number;

  @Column({ defaultValue: null })
  updated_by: number;

  @Column
  chart_id: number;

  @Column
  descriptions: string;
}
