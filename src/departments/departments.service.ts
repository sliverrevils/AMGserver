import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from './departments.model';
import { UsersService } from 'src/users/users.service';
import { OfficesService } from 'src/offices/offices.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private departmentModel: typeof Department,
    private readonly usersService: UsersService,
    private readonly officesService: OfficesService,
  ) {}

  //ALL DEPATMENTS
  async allDepartments(): Promise<Department[]> {
    return this.departmentModel.findAll();
  }
  //FIND BY ID
  async findById(id: number): Promise<Department | null> {
    return (await this.departmentModel.findOne({ where: { id } })) || null;
  }
  //FIND BY OFFICE ID
  async findByOfficeId(id: number): Promise<Department[] | null> {
    return (
      (await this.departmentModel.findAll({ where: { office_id: id } })) || null
    );
  }

  //CREATE DEPARTMENT
  async createDepartment(
    user,
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };
    if (!(await this.officesService.findById(createDepartmentDto.office_id)))
      return {
        errorMessage: `Отделение с id: ${createDepartmentDto.office_id} не найдено`,
      };
    const department = new Department();
    department.office_id = createDepartmentDto.office_id;
    department.name = createDepartmentDto.name;
    department.code = createDepartmentDto.code;
    department.descriptions = createDepartmentDto.descriptions;
    department.leadership = createDepartmentDto.leadership;
    department.ckp = createDepartmentDto.ckp;

    return await department.save();
  }
  //DELETE DEPARTMENT
  async deleteDepartment(
    id: number,
    user: any,
  ): Promise<{ errorMessage: string } | Department[]> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };
    const department = await this.departmentModel.findOne({ where: { id } });
    if (department) {
      await department.destroy();
      return await this.departmentModel.findAll();
    } else {
      return { errorMessage: `Отдел с id: ${id} не найден` };
    }
  }
  //UPDATE
  async updateDepartament(
    id: number,
    user: any,
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department[] | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };

    if (!(await this.officesService.findById(createDepartmentDto.office_id)))
      return {
        errorMessage: `Отделение с id: ${createDepartmentDto.office_id} не найдено`,
      };

    const department = await this.departmentModel.findOne({ where: { id } });

    if (!department) return { errorMessage: `Отдел с id: ${id} не найден` };

    await department.update(createDepartmentDto);

    return this.departmentModel.findAll();
  }
}
