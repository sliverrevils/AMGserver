import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Administrator extends Model {
  @Column
  office_id: number;

  @Column
  department_id: number;

  @Column
  section_id: number;

  @Column
  user_id: number;

  @Column
  descriptions: string;

  @Column({ defaultValue: '[]' })
  charts: string;
}
