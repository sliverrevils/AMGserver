import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DirectService } from './direct.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { UserI } from 'src/auth/types/typesAuth';
import { DirectSaveDto } from './dto/direct-save.dto';

@Controller('direct')
export class DirectController {
  constructor(private readonly directService: DirectService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('settings')
  getSettings() {
    return this.directService.getSettings();
  }

  @UseGuards(AuthenticatedGuard)
  @Post('set-headers')
  setHeaders(
    @Request() { user }: { user: UserI },
    @Body() body: { headers: string },
  ) {
    if (user.role === 'admin') {
      return this.directService.setHeaders({ headers: body.headers });
    } else {
      return { errorMessage: 'Требутся права администратора' };
    }
  }
  @UseGuards(AuthenticatedGuard)
  @Post('set-logic')
  setLogic(
    @Request() { user }: { user: UserI },
    @Body() body: { cacheStatsLogics: string },
  ) {
    if (user.role === 'admin') {
      return this.directService.setLogic({
        cacheStatsLogics: body.cacheStatsLogics,
      });
    } else {
      return { errorMessage: 'Требутся права администратора' };
    }
  }
  @UseGuards(AuthenticatedGuard)
  @Get('dir-list')
  getDirList() {
    return this.directService.getProtocolsList();
  }

  @UseGuards(AuthenticatedGuard)
  @Get('dir-by-id/:id')
  getDirById(@Param('id') id: number) {
    return this.directService.getProtocolById({ id });
  }
  @UseGuards(AuthenticatedGuard)
  @Get('dir-del-id/:id')
  delDirById(@Param('id') id: number, @Request() { user }: { user: UserI }) {
    if (user.role === 'admin')
      return this.directService.deleteProtocolById({ id });
    else return { errorMessage: 'Требутся права администратора' };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('dir-save')
  directSave(
    @Body() saveDir: DirectSaveDto,
    @Request() { user }: { user: UserI },
  ) {
    return this.directService.directSave({ saveDir, user });
  }
}
