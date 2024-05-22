import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chart } from './charts.model';
import { IChartQuery } from './types';
import { UsersService } from 'src/users/users.service';
import { CreateChartDto } from './dto/create-chart.dto';
import { UserI } from 'src/auth/types/typesAuth';
import { where } from 'sequelize';

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
    chart.descriptions = createChartDto.descriptions;
    chart.created_by = user.userId;

    return chart.save();
  }

  //1.59
  async updateChart(
    id: number,
    createChartDto: CreateChartDto,
    user,
  ): Promise<Chart | { errorMessage: string }> {
    const chart = await this.findOneByStatId({ statId: id });
    if (user.role === 'admin' || chart.created_by == user.userId) {
      await this.chartModel.update(
        { ...createChartDto, updated_by: user.userId },
        { where: { id } },
      );

      return chart;
    } else {
      return { errorMessage: 'У вас нет доступа к этой статистике ' };
    }
  }
  // async updateChart(id: number, delta: number): Promise<Chart> {
  //   await this.chartModel.update({ delta }, { where: { id } });
  //   const chart = this.findOneByStatId({ statId: id });
  //   return chart;
  // }

  async updateInfo(id: number, info: string): Promise<any[]> {
    //console.log('REQ', id, info);
    const res = await this.chartModel.update(
      { descriptions: info },
      { where: { id } },
    );

    // console.log('RES', res);
    const allPatterns = await this.chartModel.findAll();
    return allPatterns;
  }

  async deleteChart(
    id: number,
  ): Promise<{ message: string } | { errorMessage: string }> {
    const chart = await this.chartModel.findOne({ where: { id } });
    if (chart) {
      await chart.destroy();
      return { message: 'Шаблон успешно удалён' };
    } else {
      return { errorMessage: 'Шаблон не найден' };
    }
  }

  //ACCESS
  async accessedChartsForUser(
    user: UserI,
    id: number,
  ): Promise<Chart[] | { errorMessage: string }> {
    if (user.role === 'admin' || user.userId == id) {
      const charts = await this.chartModel.findAll();
      return charts.filter((chart) =>
        (JSON.parse(chart.access || '[]') as number[]).some(
          (id: number) => id == user.userId,
        ),
      );
    } else {
      return { errorMessage: 'Требуются права администратора ' };
    }
  }
  //add
  async addAccessForUser(
    user: UserI,
    chartId: number,
    userId: number,
  ): Promise<Chart | { errorMessage: string }> {
    if (user.role === 'admin') {
      const chart = await this.chartModel.findOne({ where: { id: chartId } });
      const access = JSON.stringify([
        ...new Set([...(JSON.parse(chart.access) as number[]), userId]),
      ]);
      return chart.update({ access });
    } else {
      return { errorMessage: 'Требуются права администратора ' };
    }
  }
  //remove
  async removeAccessForUser(
    user: UserI,
    chartId: number,
    userId: number,
  ): Promise<Chart | { errorMessage: string }> {
    if (user.role === 'admin') {
      const chart = await this.chartModel.findOne({ where: { id: chartId } });
      const access = JSON.stringify(
        (JSON.parse(chart.access) as number[]).filter((id) => id != userId),
      );
      return chart.update({ access });
    } else {
      return { errorMessage: 'Требуются права администратора ' };
    }
  }
}
