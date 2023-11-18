import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Office } from './offices.model';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UsersService } from 'src/users/users.service';
import { UserI } from 'src/auth/types/typesAuth';
import { DepartmentsService } from 'src/departments/departments.service';

@Injectable()
export class OfficesService {
  constructor(
    @InjectModel(Office)
    private officeModel: typeof Office,
    private readonly usersService: UsersService, //  private readonly departmentService: DepartmentsService,
  ) {}

  async allOffices(): Promise<Office[]> {
    return this.officeModel.findAll();
  }

  async findById(id: number): Promise<Office | null> {
    return this.officeModel.findOne({ where: { id } });
  }

  async createOffice(
    createOfficeDto: CreateOfficeDto,
    user: any,
  ): Promise<Office | { warningMessage: string }> {
    if (user.role === 'admin') {
      const office = new Office();
      office.name = createOfficeDto.name;
      if (createOfficeDto.leadership) {
        const user = await this.usersService.findOne({
          where: { id: String(createOfficeDto.leadership) },
        });
        if (!user) {
          return {
            warningMessage: `Пользователь с id: ${createOfficeDto.leadership} не зарегестрирован`,
          };
        }
      }

      office.leadership = createOfficeDto.leadership;
      office.descriptions = createOfficeDto.descriptions;
      office.ckp = createOfficeDto.ckp;

      return office.save();
    }
    return {
      warningMessage: 'Создание отделения доступно только администратору',
    };
  }

  async updateOffice(
    id: string,
    createOfficeDto: CreateOfficeDto,
    user: any,
  ): Promise<Office | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Доступно только администраторам' };

    const office = await this.officeModel.findOne({ where: { id: +id } });
    if (!office) return { errorMessage: `Отделение с id: ${id} не найдено` };

    return await office.update({ ...createOfficeDto });
  }

  async deleteOffice(
    id: number,
    user: any,
  ): Promise<Office[] | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Необходимы права администратора' };
    const office = await this.officeModel.findOne({ where: { id } });
    if (!office) return { errorMessage: `Отделение с id: ${id} не найдено` };
    await office.destroy();
    return this.officeModel.findAll();
  }

  //PATTERNS
  //add main pattern
  async addMainPattern(
    section_id: number,
    pattern_id: number,
    user: UserI,
  ): Promise<{ message: string } | { errorMessage: string }> {
    if (user.role == 'admin') {
      const section = await this.officeModel.findOne({
        where: { id: section_id },
      });
      section.update({ mainPattern: pattern_id });
      return { message: 'Главный шаблон успешно изменён' };
    } else {
      return { errorMessage: 'Требуются права администратора' };
    }
  }
  //add patern
  async addPattern(
    section_id: number,
    pattern_id: number,
    user: UserI,
  ): Promise<{ message: string } | { errorMessage: string }> {
    if (user.role == 'admin') {
      const section = await this.officeModel.findOne({
        where: { id: section_id },
      });
      const patterns = JSON.stringify([
        ...new Set([...JSON.parse(section.patterns), pattern_id]),
      ]);
      section.update({ patterns });
      return { message: 'Дополнительный шаблон успешно добавлен' };
    } else {
      return { errorMessage: 'Требуются права администратора' };
    }
  }
  //del pattern
  async delPattern(
    section_id: number,
    pattern_id: number,
    user: UserI,
  ): Promise<{ message: string } | { errorMessage: string }> {
    if (user.role == 'admin') {
      const section = await this.officeModel.findOne({
        where: { id: section_id },
      });
      const patterns = JSON.stringify(
        JSON.parse(section.patterns).filter((id) => id != pattern_id),
      );
      section.update({ patterns });
      return { message: 'Дополнительный шаблон успешно удален' };
    } else {
      return { errorMessage: 'Требуются права администратора' };
    }
  }
}
