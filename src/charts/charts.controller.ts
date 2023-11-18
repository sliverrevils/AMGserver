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
import { UserI } from 'src/auth/types/typesAuth';

@Controller('charts')
export class ChartsController {
  constructor(private readonly chartsServise: ChartsService) {}

  // ALL STATS "/charts?limit=5&offset=1"
  @UseGuards(AuthenticatedGuard)
  @Get()
  paginateAndFilter(@Query() query) {
    return this.chartsServise.paginateAndFilter(query);
  }
  // @UseGuards(AuthenticatedGuard)
  // @Get('all')
  // allPatterns() {
  //   return this.getAll();
  // }

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
  //DELETE CHART
  @UseGuards(AuthenticatedGuard)
  @Get('delete/:id')
  deleteChart(@Request() { user }: { user: UserI }, @Param('id') id: number) {
    if (user.role == 'admin') return this.chartsServise.deleteChart(id);
    else return { errorMessage: 'Требуются права администратора' };
  }

  //GET ALL
  @UseGuards(AuthenticatedGuard)
  @Get('all')
  getAll(@Request() { user }: { user: UserI }) {
    if (user.role === 'admin') return this.chartsServise.getAllCharts();
    else return { errorMessage: 'Требуются права администратора' };
  }

  //UPDATE CHART
  @UseGuards(AuthenticatedGuard)
  @Post('updateInfo/:id')
  updateInfo(
    @Request() { user }: { user: UserI },
    @Body() { info }: { info: string },
    @Param('id') id: number,
  ) {
    if (user.role === 'admin') return this.chartsServise.updateInfo(id, info);
    else return { errorMessage: 'Требуются права администратора' };
  }

  //-------------------ACCESS

  //ACCESSED FOR USER || ADMIN LOOK USERS CHARTS
  @UseGuards(AuthenticatedGuard)
  @Get('users-charts/:id')
  usersCharts(@Request() { user }, @Param('id') id: number) {
    return this.chartsServise.accessedChartsForUser(user, id);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('add-access/:chartId')
  addAccess(
    @Param('chartId') chartId: number,
    @Request() { user }: { user: UserI },
    @Body() { userId }: { userId: number },
  ) {
    return this.chartsServise.addAccessForUser(user, chartId, userId);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('remove-access/:chartId')
  removeAccess(
    @Param('chartId') chartId: number,
    @Request() { user }: { user: UserI },
    @Body() { userId }: { userId: number },
  ) {
    return this.chartsServise.removeAccessForUser(user, chartId, userId);
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
