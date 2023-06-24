import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { InfoService } from './info.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

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
  userAllPatterns(@Request() { user }, @Param('id') id: number) {
    return this.infoService.userAllChartPatterns(id);
  }
}
