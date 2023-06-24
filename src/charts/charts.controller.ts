import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Post,
  Body,
  HttpCode,
  Header,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ChartsService } from './charts.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CreateChartDto } from './dto/create-chart.dto';

@Controller('charts')
export class ChartsController {
  constructor(private readonly chartsServise: ChartsService) {}

  // ALL STATS "/charts?limit=5&offset=1"
  @UseGuards(AuthenticatedGuard)
  @Get()
  paginateAndFilter(@Query() query) {
    return this.chartsServise.paginateAndFilter(query);
  }
  @UseGuards(AuthenticatedGuard)
  @Get('all')
  allPatterns() {
    return this.getAll();
  }

  // FIND STAT BY ID "/charts/find/2"
  @UseGuards(AuthenticatedGuard)
  @Get('find/:id')
  getOne(@Param('id') id: string) {
    return this.chartsServise.findOneByStatId({ statId: +id });
  }

  // ALL USER STATS BY USER ID "/charts/user-stats/5"
  @UseGuards(AuthenticatedGuard)
  @Get('user-stats/:id')
  userStats(@Param('id') id: string) {
    return this.chartsServise.allByUserID({ userId: +id });
  }

  //--------NEW

  //CREATE CHART
  @UseGuards(AuthenticatedGuard)
  @Post('create')
  @Header('Content-type', 'application/json')
  createChart(@Body() createChartDto: CreateChartDto, @Request() { user }) {
    return this.chartsServise.createChart(createChartDto, user);
  }
  //GET ALL
  @Get('all')
  getAll() {
    return this.chartsServise.getAllCharts();
  }

  // //UPDATE CHART
  // @UseGuards(AuthenticatedGuard)
  // @Post('update/:id')
  // updateChart(
  //   @Body() createChartDto: CreateChartDto,
  //   @Param('id') id: string,
  //   @Request() { user },
  // ) {
  //   return this.chartsServise.updateChart(+id, createChartDto, user);
  // }
}
