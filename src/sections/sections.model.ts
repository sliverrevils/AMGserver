import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Section extends Model {
  @Column
  office_id: number;

  @Column
  department_id: number;

  @Column
  name: string;

  @Column
  leadership: number;

  @Column({ defaultValue: '[]' })
  administrators: string;

  @Column
  ckp: string;

  @Column
  descriptions: string;
}
