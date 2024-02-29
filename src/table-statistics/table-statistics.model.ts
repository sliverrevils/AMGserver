import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class TableStatistic extends Model {
  @Column
  tableName: string;
  @Column
  dateStart: number;
  @Column
  dateEnd: number;
  @Column
  headers: string;
  @Column
  rows: string;
  @Column
  tableDescriptions: string;
  @Column
  tableDescriptionsName: string;
  @Column
  columnsWidth: string;
  @Column
  dateColumn: string;
  @Column
  about: string;
}
