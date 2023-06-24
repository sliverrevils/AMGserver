import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddAdministratorDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  readonly office_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  readonly department_id: number;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  readonly newAdministratorId: number;
}
