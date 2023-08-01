import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UserI } from 'src/auth/types/typesAuth';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  //GET ALL BY USER ID
  @UseGuards(AuthenticatedGuard)
  @Get(`all/:id`)
  allByUserId(@Param('id') id: number, @Request() { user }) {
    return this.statisticsService.getAllbyUserID(id, user);
  }

  //GET PERIOD BY USER ID
  @UseGuards(AuthenticatedGuard)
  @Post(`period/:id`)
  periodByUserId(
    @Param('id') id: number,
    @Body() body: { dateStart: number; dateEnd: number; pattern: number },
  ) {
    return this.statisticsService.getPeriodByUserID(
      body.dateStart,
      body.dateEnd,
      id,
      body.pattern,
    );
  }

  //CREATE
  @UseGuards(AuthenticatedGuard)
  @Post(`create`)
  createStatistic(
    @Body() createStatisticDto: CreateStatisticDto,
    @Request() { user },
  ) {
    return this.statisticsService.createStatistic(user, createStatisticDto);
  }
  //ALL USER STATS BY CHART ID
  @UseGuards(AuthenticatedGuard)
  @Get('stats_by_chart_id/:id')
  allUsersStatsByChartId(@Request() { user }, @Param('id') id: number) {
    return this.statisticsService.allUsersStatsByChartId(id, user);
  }
}
