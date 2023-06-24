import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Administrator } from './administrators.model';
import { UsersService } from 'src/users/users.service';
import { SectionsService } from 'src/sections/sections.service';
import { CreateAdministratorDto } from './dto/create-administrator.dto';

@Injectable()
export class AdministratorsService {
  constructor(
    @InjectModel(Administrator)
    private administratorModel: typeof Administrator,
    private readonly usersService: UsersService,
    private readonly sectionsService: SectionsService,
  ) {}
  //FIND BY ID
  async findById(id: number): Promise<Administrator | null> {
    return (await this.administratorModel.findOne({ where: { id } })) || null;
  }
  //FIND BY SECTION ID
  async findBySectionId(
    id: number,
    user?,
  ): Promise<Administrator[] | { errorMessage: string }> {
    // if (user?.role !== 'admin')
    //   return { errorMessage: 'Требуются права администратора' };

    return this.administratorModel.findAll({ where: { section_id: id } });
  }

  //FIND BY USER ID
  async findByUserId(
    id: number,
  ): Promise<Array<Administrator | null> | { errorMessage: string }> {
    return this.administratorModel.findAll({ where: { user_id: id } });
  }

  //CREATE ADMINISTRATOR
  async createAdministrator(
    user,
    createAdministratorDto: CreateAdministratorDto,
  ): Promise<Administrator | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };

    if (
      await this.administratorModel.findOne({
        where: {
          user_id: createAdministratorDto.user_id,
          section_id: createAdministratorDto.section_id,
        },
      })
    ) {
      return { errorMessage: 'Сотрудник уже в списке администраторов' };
    }

    const administrator = new Administrator();
    administrator.office_id = createAdministratorDto.office_id;
    administrator.department_id = createAdministratorDto.department_id;
    administrator.section_id = createAdministratorDto.section_id;
    administrator.user_id = createAdministratorDto.user_id;
    administrator.charts = createAdministratorDto.charts;
    administrator.descriptions = createAdministratorDto.descriptions;

    return await administrator.save();
  }
  //DELETE ADMINISTRATOR
  async deleteAdministrator(
    user: any,
    id: number,
  ): Promise<{ message: string } | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };
    const administrator = await this.administratorModel.findOne({
      where: { id },
    });
    if (administrator) {
      await administrator.destroy();
      return { message: 'Администратор успешно удалён' };
    } else {
      return { errorMessage: `Администратор с id: ${id} не найден` };
    }
  }
  //ADD CHART
  async addChart(
    id: number,
    chart_id: number,
    //createAdministratorDto: CreateAdministratorDto,
    user: any,
  ): Promise<Administrator | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };

    const admin = await this.administratorModel.findOne({ where: { id } });
    if (admin) {
      const chartsArr: any = JSON.parse(admin.charts);
      const charts = JSON.stringify([...new Set([...chartsArr, chart_id])]);

      return await admin.update({ charts });
    } else {
      return { errorMessage: `Администратор с id: ${id} не найден` };
    }
  }
  //DELETE CHART
  async deleteChart(
    id: number,
    chart_id: number,
    user: any,
  ): Promise<Administrator | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };

    const admin = await this.administratorModel.findOne({ where: { id } });
    if (admin) {
      const chartsArr: any = JSON.parse(admin.charts);
      const charts = JSON.stringify(
        chartsArr.filter((el_chart_id: number) => el_chart_id !== chart_id),
      );

      return await admin.update({ charts });
    } else {
      return { errorMessage: `Администратор с id: ${id} не найден` };
    }
  }
}
