import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InfoService } from './info.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { UserI } from 'src/auth/types/typesAuth';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  getFullOrg(@Request() { user }) {
    return this.infoService.fullOrg(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(`user_patterns/:id`)
  userAllPatterns(@Param('id') id: number) {
    return this.infoService.userAllChartPatterns(id);
  }

  @UseGuards(AuthenticatedGuard)
  @Post(`raport-list`)
  getRaportList(
    @Request() { user }: { user: UserI },
    @Body() { statIdArr }: { statIdArr: number[] },
  ) {
    return this.infoService.getRaportList(statIdArr);
  }
}
