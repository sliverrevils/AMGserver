import { Module } from '@nestjs/common';
import { MainSettingsController } from './main_settings.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MainSettings } from './main_settings.model';
import { MainSettingsService } from './main_settings.service';

@Module({
  imports: [SequelizeModule.forFeature([MainSettings])],
  controllers: [MainSettingsController],
  providers: [MainSettingsService],
  exports: [MainSettingsService],
})
export class MainSettingsModule {}
