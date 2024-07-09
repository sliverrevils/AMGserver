import { Module } from '@nestjs/common';
import { DirectController } from './direct.controller';
import { DirectService } from './direct.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DirectSettings } from './direct_settings.model';
import { DirectSaves } from './direct_saves.model';
import { DirectSelectedLists } from './direct_selectedLists.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      DirectSettings,
      DirectSaves,
      DirectSelectedLists,
    ]),
  ],
  controllers: [DirectController],
  providers: [DirectService],
  exports: [DirectService],
})
export class DirectModule {}
