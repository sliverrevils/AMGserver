import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePatternDto {
  @ApiProperty({ example: 'ОТДЕЛЕНИЕ ПЕРСОНАЛА И КОММУНИКАЦИЙ' })
  @IsNotEmpty()
  readonly name: string;

  readonly headers: string;
}
