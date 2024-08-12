import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MainSettingsService } from './main_settings.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { UserI } from 'src/auth/types/typesAuth';

@Controller('main-settings')
export class MainSettingsController {
  constructor(private readonly mainService: MainSettingsService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('get')
  getMainSettings() {
    return this.mainService.getMainSettings();
  }

  @UseGuards(AuthenticatedGuard)
  @Post('set')
  setMainSettings(
    @Request() { user }: { user: UserI },
    @Body() { message }: { message: string },
  ) {
    if (user.role !== 'admin') return 'Требуются права администратора';

    return this.mainService.setMainSettings({ message });
  }
}
