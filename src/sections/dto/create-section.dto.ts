import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  readonly office_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  readonly department_id: number;

  @ApiProperty({ example: 'ЭЛЕКТРОННЫЕ КОММУНИКАЦИИ' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Описание ' })
  readonly descriptions: string;

  readonly ckp: string;

  @ApiProperty({ example: 'IDs ARRAY STRING' })
  readonly administrators: string;
}
