import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Statistic } from './statistics.model';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [SequelizeModule.forFeature([Statistic])],
  exports: [StatisticsService],
})
export class StatisticsModule {}
