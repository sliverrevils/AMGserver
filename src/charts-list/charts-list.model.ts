import { Table, Model, Column } from 'sequelize-typescript';

@Table
export class ChartList extends Model {
  @Column
  userId: number;

  @Column
  name: string; //Данные

  @Column({ defaultValue: '[]' })
  charts: string; //Данные

  @Column({ defaultValue: null })
  descriptions: string; //Описание
}
