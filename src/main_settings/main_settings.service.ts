import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainSettings } from './main_settings.model';

@Injectable()
export class MainSettingsService {
  constructor(
    @InjectModel(MainSettings) private mainSettingsModel: typeof MainSettings,
  ) {}

  async getMainSettings() {
    const existMainSet = await this.mainSettingsModel.findOne();

    if (existMainSet) {
      return existMainSet;
    }

    const firstMainSet = await this.mainSettingsModel.create({
      message: '<h3> Тут пока ничего нет </h3>',
    });

    return firstMainSet;
  }

  async setMainSettings({ message }: { message: string }) {
    const existMainSet = await this.mainSettingsModel.findOne();
    existMainSet.update({ message });
    return 'Главное сообщение успешно обновлено';
  }
}
