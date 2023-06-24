import { ApiProperty } from '@nestjs/swagger';
//ONLY FOR SWAGGER
export class LoginUserRequest {
  @ApiProperty({ example: 'user' })
  username: string;

  @ApiProperty({ example: 'semplePass123' })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({
    example: {
      user: {
        userId: 2,
        name: 'user',
        post: 'user',
        structure: 'it',
      },
    },
  })
  user: {
    userId: number;
    name: string;
    post: string;
    structure: string;
  };

  @ApiProperty({ example: 'Успешная авторизация: user.' })
  message: string;
}

export class LogoutUserResponse {
  @ApiProperty({ example: 'Сессия закрыта' })
  message: string;
}

export class LoginCheckResponse {
  @ApiProperty({ example: 2 })
  userId: number;

  @ApiProperty({ example: 'user' })
  name: string;

  @ApiProperty({ example: 'user' })
  post: string;

  @ApiProperty({ example: 'it' })
  structure: string;
}

export class SignupResponse {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'user' })
  name: string;

  @ApiProperty({
    example: '$2b$10$ROMXR91gwXSKWb4VsHpx/OyzL05GBQqWXbchN38TYJu7P2SZloC',
  })
  password: string;

  @ApiProperty({ example: 'user' })
  post: string;

  @ApiProperty({ example: 'it' })
  structure: string;

  @ApiProperty({ example: '2023-05-20T07:30:54.042Z' })
  updatedAt: string;

  @ApiProperty({ example: '2023-05-20T07:30:54.042Z' })
  createdAt: string;
}
