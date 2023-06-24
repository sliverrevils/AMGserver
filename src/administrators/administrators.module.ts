import { Module } from '@nestjs/common';
import { AdministratorsController } from './administrators.controller';
import { AdministratorsService } from './administrators.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Administrator } from './administrators.model';
import { UsersModule } from 'src/users/users.module';
import { SectionsModule } from 'src/sections/sections.module';

@Module({
  controllers: [AdministratorsController],
  providers: [AdministratorsService],
  imports: [
    SequelizeModule.forFeature([Administrator]),
    UsersModule,
    SectionsModule,
  ],
  exports: [AdministratorsService],
})
export class AdministratorsModule {}
