import { Injectable } from '@nestjs/common';
import { Statistic } from './statistics.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserI } from 'src/auth/types/typesAuth';
import { CreateStatisticDto } from './dto/create-statistic.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Statistic) private statisticModel: typeof Statistic,
  ) {}

  //GET ALL BY USER ID
  async getAllbyUserID(
    id: number,
    user: UserI,
  ): Promise<Statistic[] | { errorMessage: string }> {
    if (user.role === 'admin' || user.userId == id)
      return this.statisticModel.findAll({ where: { created_by: id } });
    else return { errorMessage: `Требуются права администратора` };
  }

  //GET ALL BY CHART ID
  async allUsersStatsByChartId(
    chart_id: number,
    user: UserI,
  ): Promise<Array<Statistic> | { errorMessage: string }> {
    return this.statisticModel.findAll({
      where: { chart_id, created_by: user.userId },
    });
  }

  //GET BY DATES PERIOD
  async getPeriodByUserID(
    dateStartBody: number,
    dateEndBody: number,
    userId: number,
    chartId: number,
  ): Promise<Array<Statistic>> {
    console.log('CHART ID', chartId);
    let allStats: Statistic[] = [];
    if (+userId) {
      //by user id
      allStats = await this.statisticModel.findAll({
        where: { chart_id: chartId },
      });
    } else {
      //all stats
      allStats = await this.statisticModel.findAll({
        where: { chart_id: chartId },
      });
    }
    console.log('DATE ⏲️', dateStartBody, dateEndBody);
    return allStats
      .filter((stat) => +stat.dateStart >= dateStartBody)
      .filter((stat) => (dateEndBody ? +stat.dateEnd <= dateEndBody : true));
  }

  //GET ALL BY PERIOD
  async getAllLastRecords(
    dateStart: number,
    dateEnd: number,
  ): Promise<Statistic[]> {
    let allStats = await this.statisticModel.findAll();

    if (dateStart) {
      allStats = [
        ...allStats.filter(
          (stat) => new Date(stat.createdAt).getTime() >= dateStart,
        ),
      ];
    }

    if (dateEnd) {
      allStats = [
        ...allStats.filter(
          (stat) => new Date(stat.createdAt).getTime() <= dateEnd,
        ),
      ];
    }

    return allStats;
  }

  //CREATE
  async createStatistic(
    user: UserI,
    createStatisticDto: CreateStatisticDto,
  ): Promise<Statistic | { errorMessage: string }> {
    if (user.role === 'admin' || user.userId == createStatisticDto.created_by) {
      const statistic = new Statistic();
      statistic.dateStart =
        createStatisticDto.dateStart || new Date().getTime() + '';
      statistic.dateEnd =
        createStatisticDto.dateEnd || new Date().getTime() + '';
      statistic.fields = createStatisticDto.fields;
      statistic.created_by = createStatisticDto.created_by || user.userId;
      statistic.chart_id = createStatisticDto.chart_id;
      statistic.descriptions = createStatisticDto.descriptions;

      return statistic.save();
    } else return { errorMessage: `Требуются права администратора` };
  }

  //UPDATE
  async updateStatistic(
    user: UserI,
    id: number,
    createStatisticDto: CreateStatisticDto,
  ): Promise<Statistic | { errorMessage: string }> {
    const currentStat = await this.statisticModel.findOne({ where: { id } });
    // if (user.role === 'admin' || user.userId == currentStat.created_by) {
    return await currentStat.update({
      ...createStatisticDto,
      updated_by: user.userId,
    });
    // } else {
    //   return { errorMessage: 'Требуются права администратора' };
    // }
  }

  //DELETE
  async deleteStatistic(
    user: UserI,
    id: number,
  ): Promise<{ message: string } | { errorMessage: string }> {
    const currentStat = await this.statisticModel.findOne({ where: { id } });
    console.log('CURRENT STAT', currentStat);
    // if (user.role === 'admin' || user.userId == currentStat.created_by) {
    const deleted = await currentStat.destroy();
    console.log('DELETED', deleted);
    return { message: `Запись статистики с была удалена` };
    // } else {
    //   return { errorMessage: 'Требуются права администратора' };
    // }
  }
  //DELETE ALL BT CHART ID
  async deleteAllByChartId(
    user: UserI,
    chart_id: number,
  ): Promise<{ message: string } | { errorMessage: string }> {
    if (user.role === 'admin') {
      await this.statisticModel.destroy({ where: { chart_id } });

      return { message: `Все записи по шаблону с ID:${chart_id} были удалены` };
    } else {
      return { errorMessage: 'Требуются права администратора' };
    }
  }
}
