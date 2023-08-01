import { Table, Model, Column } from 'sequelize-typescript';

@Table
export class Chart extends Model {
  @Column
  name: string; //Данные

  @Column({ defaultValue: '[]' })
  fields: string; //Данные

  @Column({ defaultValue: '[]' })
  lines: string; //Данные

  @Column({ defaultValue: '[]' })
  access: string; //Доступ [userIds]

  @Column({ defaultValue: null })
  descriptions: string; //Описание

  @Column
  created_by: string; //Кем создана ID

  @Column
  updated_by: string; //Кем обновлена ID
}
