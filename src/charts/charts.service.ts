import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chart } from './charts.model';
import { IChartQuery } from './types';
import { UsersService } from 'src/users/users.service';
import { CreateChartDto } from './dto/create-chart.dto';

@Injectable()
export class ChartsService {
  constructor(
    @InjectModel(Chart)
    private chartModel: typeof Chart,
    private readonly usersService: UsersService,
  ) {}

  async paginateAndFilter(
    query: IChartQuery,
  ): Promise<{ count: number; rows: Chart[] }> {
    const limit = +query.limit;
    const offset = +query.offset * 20;
    return this.chartModel.findAndCountAll({ limit, offset });
  }

  async getAllCharts(): Promise<Chart[]> {
    return this.chartModel.findAll();
  }

  async allByUserID(query: {
    userId: number;
  }): Promise<{ count: number; rows: Chart[] }> {
    return this.chartModel.findAndCountAll({
      where: { created_by: query.userId },
    });
  }

  async findOneById(id: number): Promise<Chart> {
    return this.chartModel.findOne({ where: { id } });
  }

  async findOneByStatId(query: { statId: number }): Promise<Chart> {
    return this.chartModel.findOne({
      where: { id: query.statId },
    });
  }

  async createChart(
    createChartDto: CreateChartDto,
    user: any,
  ): Promise<Chart | { errorMessage: string }> {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };

    const chart = new Chart();
    chart.name = createChartDto.name;
    chart.fields = createChartDto.fields;
    chart.lines = createChartDto.lines;
    chart.created_by = user.userId;

    return chart.save();
  }

  //1.59
  async updateChart(
    id: number,
    createChartDto: CreateChartDto,
    user,
  ): Promise<Chart | { mesage: string }> {
    const chart = await this.findOneByStatId({ statId: id });
    if (user.role === 'admin' || chart.created_by == user.userId) {
      await this.chartModel.update(
        { ...createChartDto, updated_by: user.userId },
        { where: { id } },
      );

      return chart;
    } else {
      return { mesage: 'У вас нет доступа к этой статистике ' };
    }
  }
  // async updateChart(id: number, delta: number): Promise<Chart> {
  //   await this.chartModel.update({ delta }, { where: { id } });
  //   const chart = this.findOneByStatId({ statId: id });
  //   return chart;
  // }

  async deleteChart(id: number) {
    const chart = await this.chartModel.findOne({ where: { id } });
    await chart.destroy();
  }
}
