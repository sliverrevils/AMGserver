import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Office extends Model {
  @Column
  name: string; // ОТДЕЛЕНИЕ ПЕРСОНАЛА И КОММУНИКАЦИЙ

  @Column({ defaultValue: null })
  leadership: number; // USER_ID

  @Column
  ckp: string;

  @Column({ defaultValue: null })
  descriptions: string; // ОПИСАНИЕ
}
