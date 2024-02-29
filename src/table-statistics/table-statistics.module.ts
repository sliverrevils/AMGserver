import { Module } from '@nestjs/common';
import { TableStatisticsController } from './table-statistics.controller';
import { TableStatisticsService } from './table-statistics.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TableStatistic } from './table-statistics.model';

@Module({
  imports: [SequelizeModule.forFeature([TableStatistic])],
  controllers: [TableStatisticsController],
  providers: [TableStatisticsService],
  exports: [TableStatisticsService],
})
export class TableStatisticsModule {}
