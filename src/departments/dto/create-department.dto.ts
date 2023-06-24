import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  readonly office_id: number;

  @ApiProperty({ example: 'КОММУНИКАЦИИ' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: '2Б' })
  @IsNotEmpty()
  readonly code: string;

  @ApiProperty({ example: 'ОБЩЕНИЕ' })
  readonly descriptions: string;

  readonly ckp: string;

  @ApiProperty({ example: 1 })
  readonly leadership: number;
}
