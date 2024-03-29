import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChartList } from './charts-list.model';
import { UserI } from 'src/auth/types/typesAuth';
import { CreateChartListDto } from './dto/create-chartList.dto';

@Injectable()
export class ChartsListService {
  constructor(
    @InjectModel(ChartList)
    private chartListModel: typeof ChartList,
  ) {}

  async getAllUsersLists(user: UserI): Promise<ChartList[]> {
    return this.chartListModel.findAll({ where: { userId: user.userId } });
  }

  async createChartsList(
    user: UserI,
    createChartListDto: CreateChartListDto,
  ): Promise<ChartList[]> {
    const chartList = new ChartList();
    chartList.userId = user.userId;
    chartList.name = createChartListDto.name;
    chartList.charts = createChartListDto.charts;
    chartList.descriptions = createChartListDto.descriptions;
    await chartList.save();
    return await this.chartListModel.findAll({
      where: { userId: user.userId },
    });
  }

  async deleteChartList(user: UserI, listId: number): Promise<ChartList[]> {
    const list = await this.chartListModel.findOne({ where: { id: listId } });
    if (list && list.userId == user.userId) {
      await list.destroy();
    }

    return await this.chartListModel.findAll({
      where: { userId: user.userId },
    });
  }

  async updateList(
    user: UserI,
    listId: number,
    charts: string,
    descriptions: string,
  ): Promise<ChartList[]> {
    const currentList = await this.chartListModel.findOne({
      where: { id: listId },
    });
    if (currentList) {
      await currentList.update({ charts, descriptions });
    }

    return await this.chartListModel.findAll({
      where: { userId: user.userId },
    });
  }

  async chartToUser(
    user: UserI,
    chartId: number,
    userId: number,
  ): Promise<{ message: string } | { errorMessage: string }> {
    if (user.role == 'admin') {
      const chart = await this.chartListModel.findOne({
        where: { id: chartId },
      });
      if (chart) {
        const chartList = new ChartList();
        chartList.userId = userId;
        chartList.name = chart.name + `-[admin]`;
        chartList.charts = chart.charts;
        chartList.descriptions = chart.descriptions;
        await chartList.save();
        return { message: 'Граффик лист успешно добавлен пользователю' };
      } else {
        return { errorMessage: 'Лист не найден' };
      }
    } else {
      return { errorMessage: 'Требуются права администратора' };
    }
  }
}
