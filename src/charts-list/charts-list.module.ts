import { Module } from '@nestjs/common';
import { ChartsListController } from './charts-list.controller';
import { ChartsListService } from './charts-list.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChartList } from './charts-list.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ChartsListController],
  providers: [ChartsListService],
  exports: [ChartsListService],
  imports: [SequelizeModule.forFeature([ChartList]), UsersModule],
})
export class ChartsListModule {}
