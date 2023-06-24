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
}
