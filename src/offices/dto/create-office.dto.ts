import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOfficeDto {
  @ApiProperty({ example: 'ОТДЕЛЕНИЕ ПЕРСОНАЛА И КОММУНИКАЦИЙ' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'user_id' })
  readonly leadership: number;

  readonly ckp: string;

  readonly descriptions: string;
}
