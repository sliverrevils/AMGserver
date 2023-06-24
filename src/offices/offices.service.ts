import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Office } from './offices.model';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OfficesService {
  constructor(
    @InjectModel(Office)
    private officeModel: typeof Office,
    private readonly usersService: UsersService,
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
}
