import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Department } from './departments.model';
import { UsersModule } from 'src/users/users.module';
import { OfficesModule } from 'src/offices/offices.module';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
  imports: [
    SequelizeModule.forFeature([Department]),
    UsersModule,
    OfficesModule,
  ],
})
export class DepartmentsModule {}
