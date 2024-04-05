import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserI } from 'src/auth/types/typesAuth';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  findOne(filter: { where: { id?: string; email?: string } }): Promise<User> {
    return this.userModel.findOne({ ...filter });
  }

  async create(
    createUserDto: CreateUserDto,
    userAuth: any,
  ): Promise<User | { warningMessage: string }> {
    const user = new User();
    const existingByUserName = await this.findOne({
      where: { email: createUserDto.email },
    });

    if (existingByUserName) {
      return { warningMessage: 'Пользователь с таким email уже существует' };
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    user.email = createUserDto.email;
    user.name = createUserDto.name;
    user.password = hashedPassword;
    user.post = createUserDto.post;
    user.structure = createUserDto.structure;

    if (userAuth?.role === 'admin') {
      user.is_verificated = true;
    }

    if (createUserDto.email === 'admin@admin.com') {
      //ADMIN REG
      user.is_verificated = true;
      user.role = 'admin';
    }

    return user.save();
  }

  async allUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async verificateUser(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ where: { id } });

    if (user) {
      await this.userModel.update({ is_verificated: true }, { where: { id } });
      return { message: `пользователь с id:${id} верифицирован` };
    } else {
      return { message: `пользователь с id:${id} не найден` };
    }
  }

  async blockUser(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ where: { id } });

    if (user && user.role !== 'admin') {
      await this.userModel.update(
        { is_blocked: !user.is_blocked },
        { where: { id } },
      );
      return {
        message: `пользователь с id:${id} ${
          user.is_blocked ? 'разблокирован' : 'заблокирован'
        }`,
      };
    } else {
      return { message: `пользователь с id:${id} не найден` };
    }
  }

  async updateUser(
    user,
    id: string,
    name: string,
    login: string,
  ): Promise<{ message: string } | { errorMessage: string }> {
    if (user.role !== 'admin') {
      return { errorMessage: 'Требуются права администратора' };
    }
    const currentUser = await this.userModel.findOne({ where: { id } });
    currentUser.name = name;
    currentUser.email = login;
    await currentUser.save();
    return { message: 'Данные пользователя обновлены' };
  }

  async changePassUser(
    user: UserI,
    id: number,
    password: string,
  ): Promise<{ message: string } | { errorMessage: string }> {
    if (user.role !== 'admin' && user.userId != id) {
      return { errorMessage: 'Требуются права администратора' };
    }
    const currentUser = await this.userModel.findOne({ where: { id } });
    currentUser.password = await bcrypt.hash(password, 10);
    await currentUser.save();
    return { message: `Пароль был успешно изменен !` };
  }
}
