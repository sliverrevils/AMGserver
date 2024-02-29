import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Pattern extends Model {
  @Column({ defaultValue: '' })
  name: string;

  @Column({ defaultValue: '[]' })
  headers: string;
}
