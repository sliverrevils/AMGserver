import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TableStatistic } from './table-statistics.model';
import { UserI } from 'src/auth/types/typesAuth';
import { CreateTableStatisticDto } from './dto/create-tablestatistic.dto';

@Injectable()
export class TableStatisticsService {
  constructor(
    @InjectModel(TableStatistic)
    private tableStatisticModel: typeof TableStatistic,
  ) {}

  async getAll(): Promise<{ id: number; name: string; dateColumn: string }[]> {
    return (await this.tableStatisticModel.findAll()).map((table) => ({
      id: table.id,
      name: table.tableName,
      dateColumn: table.dateColumn,
      dateStart: table.dateStart,
      lastUpdate: table.updatedAt,
    }));
  }

  async getById(id: number): Promise<TableStatistic> {
    //console.log('ID TABLE ', id);
    const table = await this.tableStatisticModel.findOne({ where: { id: id } });
    // console.log('ID TABLE ', table);
    return table;
  }

  async createTableStatistic(
    user: UserI,
    createTableStatisticDto: CreateTableStatisticDto,
  ): Promise<{ message: string } | { errorMessage: string }> {
    // открыт доступ для создания
    // if (user.role !== 'admin' || true)
    //   return { errorMessage: 'Требуются права администратора' };
    const table = new TableStatistic();
    table.tableName = createTableStatisticDto.tableName;
    table.dateStart = createTableStatisticDto.dateStart;
    table.dateEnd = createTableStatisticDto.dateEnd;
    table.headers = createTableStatisticDto.headers;
    table.rows = createTableStatisticDto.rows;
    table.tableDescriptions = createTableStatisticDto.tableDescriptions;
    table.tableDescriptionsName = createTableStatisticDto.tableDescriptionsName;
    table.columnsWidth = createTableStatisticDto.columnsWidth;
    table.dateColumn = createTableStatisticDto.dateColumn;
    table.about = createTableStatisticDto.about;
    await table.save();
    return { message: `Статистика "${table.tableName}" сохранена !` };
  }
  async updateTableStatistic(
    statId: number,
    user: UserI,
    createTableStatisticDto: CreateTableStatisticDto,
  ): Promise<{ message: string } | { errorMessage: string }> {
    // if (user.role !== 'admin')
    //   return { errorMessage: 'Требуются права администратора' };
    const table = await this.tableStatisticModel.findOne({
      where: { id: statId },
    });
    if (!table) {
      return { errorMessage: 'Статистика не найдена' };
    }
    table.update(createTableStatisticDto);
    return { message: `Статистика "${table.tableName}"  обновлена !` };
  }

  async deleteTableStatistic(
    id: number,
    user: UserI,
  ): Promise<{ message: string } | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };
    const table = await this.tableStatisticModel.findOne({ where: { id } });
    if (!table) return { errorMessage: 'Статистика не найдена' };
    await table.destroy();
    return { message: `Статистика "${table.tableName}" удалена` };
  }
}
