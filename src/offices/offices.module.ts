import { Module } from '@nestjs/common';
import { OfficesController } from './offices.controller';
import { OfficesService } from './offices.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Office } from './offices.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Office]), UsersModule],
  controllers: [OfficesController],
  providers: [OfficesService],
  exports: [OfficesService],
})
export class OfficesModule {}
