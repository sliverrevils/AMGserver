import { Table, Model, Column } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  email: string;

  @Column
  password: string;

  @Column
  name: string;

  @Column
  post: string;

  @Column
  structure: string;

  @Column({ defaultValue: false })
  is_verificated: boolean;

  @Column({ defaultValue: false })
  is_blocked: boolean;

  @Column({ defaultValue: 'user' })
  role: string;
}
