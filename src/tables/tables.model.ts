import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class TableView extends Model {
  @Column
  name: string;

  @Column
  view_pattern_id: number;

  @Column
  created_by: number;

  @Column
  columns: string;
}
