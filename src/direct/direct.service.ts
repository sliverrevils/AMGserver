import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DirectSettings } from './direct_settings.model';
import { DirectSaveDto } from './dto/direct-save.dto';
import { UserI } from 'src/auth/types/typesAuth';
import { DirectSaves } from './direct_saves.model';
import { DirectSelectedLists } from './direct_selectedLists.model';
import { DirectSelectedListsDto } from './dto/direct-selected-lists.dto';

@Injectable()
export class DirectService {
  constructor(
    @InjectModel(DirectSettings)
    private directSettingsModel: typeof DirectSettings,
    @InjectModel(DirectSaves)
    private directSaveModel: typeof DirectSaves,
    @InjectModel(DirectSelectedLists)
    private directSelectedListsModel: typeof DirectSelectedLists,
  ) {}

  async getSettings() {
    const existingRow = await this.directSettingsModel.findOne();

    if (existingRow) {
      return existingRow;
    }

    const firstSettings = await this.directSettingsModel.create({
      columns: '',

      cacheStatsLogics: '',
    });

    return firstSettings;
  }

  async setHeaders({ headers }: { headers: string }) {
    const settings = await this.directSettingsModel.findOne();

    return settings.update({
      columns: headers,
    });
  }
  async setLogic({ cacheStatsLogics }: { cacheStatsLogics: string }) {
    const settings = await this.directSettingsModel.findOne();

    return settings.update({
      cacheStatsLogics,
    });
  }

  async getProtocolsList() {
    const list = await this.directSaveModel.findAll();

    const listReady = list.map((protocol) => {
      const members = JSON.parse(protocol.members).map(
        (member) => member.userId,
      );
      const protocolNumber = JSON.parse(protocol.info).protocol;
      return {
        id: protocol.id,
        createdAt: protocol.createdAt,
        members,
        protocolNumber,
      };
    });
    return listReady;
  }

  async isUserOnDirect({ userId }: { userId: number }): Promise<boolean> {
    const list = await this.directSaveModel.findAll();
    const allMembers = list.reduce((acc, protocol) => {
      const members = JSON.parse(protocol.members).map(
        (member) => member.userId,
      );
      return [...new Set([...acc, ...members])];
    }, []);
    return allMembers.some((member) => member === userId);
  }

  async getProtocolById({ id }: { id: number }): Promise<DirectSaves> {
    return this.directSaveModel.findOne({ where: { id } });
  }

  async deleteProtocolById({
    id,
  }: {
    id: number;
  }): Promise<{ message: string }> {
    await this.directSaveModel.destroy({ where: { id } });
    return { message: 'Протокол удалён с архива' };
  }

  async directSave({
    saveDir,
    user,
  }: {
    saveDir: DirectSaveDto;
    user: UserI;
  }): Promise<{ message: string }> {
    const dirForSave = new DirectSaves();
    dirForSave.columns = saveDir.columns;
    dirForSave.cacheStatsLogics = saveDir.cacheStatsLogics;
    dirForSave.info = saveDir.info;
    dirForSave.members = saveDir.members;
    dirForSave.tabels = saveDir.tabels;
    await dirForSave.save();

    return { message: 'Протокол успешно сохранен ' };
  }

  async getAllSelectedLists() {
    return this.directSelectedListsModel.findAll();
  }

  async saveList({
    name,
    selectedStats,
  }: DirectSelectedListsDto): Promise<DirectSelectedLists[]> {
    await this.directSelectedListsModel.create({
      name,
      selectedStats,
    });

    return this.directSelectedListsModel.findAll();
  }

  async deleteList(id: number): Promise<DirectSelectedLists[]> {
    await this.directSelectedListsModel.destroy({ where: { id } });
    return this.directSelectedListsModel.findAll();
  }
}
