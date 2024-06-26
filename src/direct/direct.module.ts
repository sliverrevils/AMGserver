import { Module } from '@nestjs/common';
import { DirectController } from './direct.controller';
import { DirectService } from './direct.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DirectSettings } from './direct_settings.model';
import { DirectSaves } from './direct_saves.model';

@Module({
  imports: [SequelizeModule.forFeature([DirectSettings, DirectSaves])],
  controllers: [DirectController],
  providers: [DirectService],
  exports: [DirectService],
})
export class DirectModule {}
