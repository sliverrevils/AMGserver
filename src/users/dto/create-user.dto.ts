import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test@ya.ru' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'Админ Админский Пдминович' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'semplePass123' })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'Руководитель службы' })
  @IsNotEmpty()
  readonly post: string;

  @ApiProperty({ example: 'отдел' })
  @IsNotEmpty()
  readonly structure: string;
}
