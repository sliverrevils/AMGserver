import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from './config/sequelizeConfig.service';
import { databaseConfig } from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { ChartsModule } from './charts/charts.module';
import { OfficesModule } from './offices/offices.module';
import { DepartmentsModule } from './departments/departments.module';
import { SectionsModule } from './sections/sections.module';
import { InfoModule } from './info/info.module';
import { AdministratorsModule } from './administrators/administrators.module';
import { StatisticsModule } from './statistics/statistics.module';
import { TablesModule } from './tables/tables.module';
import { PatternsModule } from './patterns/patterns.module';
import { TableStatisticsModule } from './table-statistics/table-statistics.module';
import { ChartsListModule } from './charts-list/charts-list.module';
import { DirectModule } from './direct/direct.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    UsersModule,
    AuthModule,
    ChartsModule,
    OfficesModule,
    DepartmentsModule,
    SectionsModule,
    InfoModule,
    AdministratorsModule,
    StatisticsModule,
    TablesModule,
    PatternsModule,
    TableStatisticsModule,
    ChartsListModule,
    DirectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
