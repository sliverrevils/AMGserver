import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateChartDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly fields: string;

  @IsNotEmpty()
  readonly lines: string;

  @ApiProperty({ example: 'about text' })
  @IsNotEmpty()
  readonly descriptions: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  readonly created_by: string;

  readonly updated_by: string;
}
