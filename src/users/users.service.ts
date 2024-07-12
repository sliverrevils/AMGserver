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

  async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ where: { id } });
    await user.destroy();
    return { message: 'Пользователь удален !' };
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
    const replaceFio = (nameStr: string): string => {
      if (nameStr == 'admin@admin.com') return nameStr;
      if (nameStr.length) {
        const names = nameStr.split(' ').filter((str) => !!str);
        const newName = `${names[2]} ${names[0]} ${names[1]}`;
        //console.log(names, newName);
        return newName;
      } else {
        return 'unnamed';
      }
    };
    const users = await this.userModel.findAll();
    users.sort((a, b) => replaceFio(a.name).localeCompare(replaceFio(b.name)));
    return users;
  }

  async verificateUser(id: number): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ where: { id } });

    if (user) {
      await this.userModel.update({ is_verificated: true }, { where: { id } });
      return { message: `пользователь с id:${id} верифицирован` };
    } else {
      return { message: `пользователь с id:${id} не найден` };
    }
  }
  async postToggle(id: number, curPost: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ where: { id } });

    if (user) {
      const userPosts = JSON.parse(user.post || '[]');
      //console.log('📃', userPosts);
      const post: string[] = userPosts.includes(curPost)
        ? userPosts.filter((post) => post !== curPost)
        : [...userPosts, curPost];
      const newPostStr = JSON.stringify(post);

      //console.log('➡️', newPostStr);
      this.userModel.update({ post: newPostStr }, { where: { id } });

      return {
        message: post.includes(curPost) ? `Доступ открыт` : `Доступ закрыт`,
      };
    } else {
      return { message: `пользователь с id:${id} не найден` };
    }
  }

  async upToAdminToggle(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ where: { id } });

    if (user) {
      await this.userModel.update(
        { role: user.role === 'user' ? 'admin' : 'user' },
        { where: { id } },
      );
      return {
        message: `пользователь "${user.email}" ${
          user.role !== 'admin'
            ? 'теперь имеет права администратора!'
            : 'вернулся в ряды пользователей!'
        }`,
      };
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
    oldPassword: string,
  ): Promise<{ message: string } | { errorMessage: string }> {
    if (user.role !== 'admin' && user.userId != id) {
      return { errorMessage: 'Требуются права администратора' };
    }

    if (user.role === 'admin') {
      const currentUser = await this.userModel.findOne({ where: { id } });
      currentUser.password = await bcrypt.hash(password, 10);
      await currentUser.save();
      return { message: `Пароль был успешно изменен !` };
    }

    if (user.userId === id) {
      const currentUser = await this.userModel.findOne({ where: { id } });
      const passValid = await bcrypt.compare(oldPassword, currentUser.password);
      if (passValid) {
        currentUser.password = await bcrypt.hash(password, 10);
        await currentUser.save();
        return { message: `Пароль был успешно изменен !` };
      } else {
        return { message: `Неверный старый пароль !` };
      }
    }
  }
}
