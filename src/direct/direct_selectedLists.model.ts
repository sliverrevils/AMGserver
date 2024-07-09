import { Model, Table, Column } from 'sequelize-typescript';

@Table
export class DirectSelectedLists extends Model {
  @Column
  name: string;

  @Column
  selectedStats: string;
}
