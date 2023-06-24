import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Department extends Model {
  [x: string]: any;
  @Column
  office_id: number;

  @Column
  name: string;

  @Column
  code: string;

  @Column
  leadership: number;

  @Column
  ckp: string;

  @Column
  descriptions: string;

  // @Column
  // sections: any;
}
