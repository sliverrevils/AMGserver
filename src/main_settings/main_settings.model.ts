import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class MainSettings extends Model {
  @Column
  message: string;
}
