import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TableView } from './tables.model';
import { UserI } from 'src/auth/types/typesAuth';
import { CreateTableDto } from './dto/create-table.dto';
import { where } from 'sequelize';

@Injectable()
export class TablesService {
  constructor(@InjectModel(TableView) private tableModel: typeof TableView) {}

  async allByPatternId(id: number): Promise<TableView[]> {
    return this.tableModel.findAll({ where: { view_pattern_id: id } });
  }

  async createTable(
    user: UserI,
    createTableDto: CreateTableDto,
  ): Promise<TableView[] | { errorMessage: string }> {
    if (user.role !== 'admin') {
      return { errorMessage: 'Требуются права администратора' };
    }
    const table = new TableView();
    table.name = createTableDto.name;
    table.view_pattern_id = createTableDto.view_pattern_id;
    table.created_by = user.userId;
    table.columns = createTableDto.columns;

    await table.save();
    return this.tableModel.findAll({
      where: { view_pattern_id: createTableDto.view_pattern_id },
    });
  }

  async deleteTable(
    user: UserI,
    id: number,
    view_pattern_id: number,
  ): Promise<TableView[] | { errorMessage: string }> {
    if (user.role === 'admin') {
      const table = await this.tableModel.findOne({ where: { id } });
      table.destroy();
      return this.tableModel.findAll({ where: { view_pattern_id } });
    } else {
      return { errorMessage: 'Требуются права администратора' };
    }
  }
}
