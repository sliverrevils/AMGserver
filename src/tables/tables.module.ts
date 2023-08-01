import { Module } from '@nestjs/common';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TableView } from './tables.model';

@Module({
  controllers: [TablesController],
  providers: [TablesService],
  imports: [SequelizeModule.forFeature([TableView])],
  exports: [TablesService],
})
export class TablesModule {}
