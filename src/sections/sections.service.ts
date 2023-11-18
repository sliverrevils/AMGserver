import { Injectable } from '@nestjs/common';
import { Section } from './sections.model';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from 'src/users/users.service';
import { OfficesService } from 'src/offices/offices.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { AddAdministratorDto } from './dto/add-administrator.dto';
import { UserI } from 'src/auth/types/typesAuth';
import { where } from 'sequelize';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section)
    private sectionModel: typeof Section,
    private readonly usersService: UsersService,
    private readonly officesService: OfficesService,
    private readonly departmentsService: DepartmentsService,
  ) {}
  //GET ALL
  async allSections(): Promise<Section[]> {
    return this.sectionModel.findAll();
  }
  //FIND ONE
  async findById(id: number): Promise<Section | null> {
    return (await this.sectionModel.findOne({ where: { id } })) || null;
  }
  //FIND BY DEPARTMENT ID
  async findByDepartmentId(id: number): Promise<Section[]> {
    return await this.sectionModel.findAll({ where: { department_id: id } });
  }
  //DELETE BY DEPARTMENT ID
  async deleteByDepartmentId(id: number) {
    this.sectionModel.destroy({ where: { department_id: id } });
  }
  //CREATE
  async createSection(
    createSectionDto: CreateSectionDto,
    user: any,
  ): Promise<Section[] | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };
    if (
      (await this.officesService.findById(createSectionDto.office_id)) &&
      (await this.departmentsService.findById(createSectionDto.department_id))
    ) {
      const section = new Section();
      section.office_id = createSectionDto.office_id;
      section.department_id = createSectionDto.department_id;
      section.name = createSectionDto.name;
      section.descriptions = createSectionDto.descriptions;
      section.administrators = createSectionDto.administrators;
      section.ckp = createSectionDto.ckp;
      section.leadership = createSectionDto.leadership;
      await section.save();
      return this.sectionModel.findAll();
    } else {
      return { errorMessage: 'Отдел либо отделение указаны не верно' };
    }
  }
  //DELETE
  async deleteSection(
    id: number,
    user: any,
  ): Promise<Section[] | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };

    const section = await this.sectionModel.findOne({ where: { id } });
    if (section) {
      await section.destroy();
      return this.sectionModel.findAll();
    } else {
      return { errorMessage: `Секция с id: ${id} не найдена` };
    }
  }
  //UPDATE
  async updateSection(
    id: number,
    createSectionDto: CreateSectionDto,
    user: any,
  ): Promise<Section | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };

    const section = await this.sectionModel.findOne({ where: { id } });
    if (section) {
      return await section.update(createSectionDto);
    } else {
      return { errorMessage: `Секция с id: ${id} не найдена` };
    }
  }

  //ADMINISTRATORS
  async addAdministrator(
    id: number,
    addAdministratorDto: AddAdministratorDto,
    user: any,
  ): Promise<Section | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };

    const section = await this.sectionModel.findOne({ where: { id } });
    if (section) {
      if (
        (await this.officesService.findById(addAdministratorDto.office_id)) &&
        (await this.departmentsService.findById(
          addAdministratorDto.department_id,
        ))
      ) {
        const administratorsRrr: any = JSON.parse(section.administrators);
        const administrators = JSON.stringify([
          ...new Set([
            ...administratorsRrr,
            addAdministratorDto.newAdministratorId,
          ]),
        ]);

        return await section.update({ ...addAdministratorDto, administrators });
      } else {
        return { errorMessage: 'Отдел либо отделение указаны не верно' };
      }
    } else {
      return { errorMessage: `Секция с id: ${id} не найдена` };
    }
  }

  //PATTERNS
  //add main pattern
  async addMainPattern(
    section_id: number,
    pattern_id: number,
    user: UserI,
  ): Promise<{ message: string } | { errorMessage: string }> {
    if (user.role == 'admin') {
      const section = await this.sectionModel.findOne({
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
      const section = await this.sectionModel.findOne({
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
      const section = await this.sectionModel.findOne({
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
