import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { UsersModule } from 'src/users/users.module';
import { OfficesModule } from 'src/offices/offices.module';
import { DepartmentsModule } from 'src/departments/departments.module';
import { SectionsModule } from 'src/sections/sections.module';
import { AdministratorsModule } from 'src/administrators/administrators.module';
import { ChartsModule } from 'src/charts/charts.module';

@Module({
  controllers: [InfoController],
  providers: [InfoService],
  imports: [
    UsersModule,
    OfficesModule,
    DepartmentsModule,
    SectionsModule,
    AdministratorsModule,
    ChartsModule,
  ],
  exports: [InfoService],
})
export class InfoModule {}
