import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chart } from './charts.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Chart]), UsersModule],
  controllers: [ChartsController],
  providers: [ChartsService],
  exports: [ChartsService],
})
export class ChartsModule {}
