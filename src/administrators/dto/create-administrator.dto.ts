import { IsNotEmpty } from 'class-validator';

export class CreateAdministratorDto {
  @IsNotEmpty()
  readonly office_id: number;

  @IsNotEmpty()
  readonly department_id: number;

  @IsNotEmpty()
  readonly section_id: number;

  @IsNotEmpty()
  readonly user_id: number;

  readonly descriptions: string;

  readonly charts: string;
}
