import { Module } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Section } from './sections.model';
import { OfficesModule } from 'src/offices/offices.module';
import { DepartmentsModule } from 'src/departments/departments.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [SectionsController],
  providers: [SectionsService],
  imports: [
    SequelizeModule.forFeature([Section]),
    OfficesModule,
    DepartmentsModule,
    UsersModule,
  ],
  exports: [SectionsService],
})
export class SectionsModule {}
