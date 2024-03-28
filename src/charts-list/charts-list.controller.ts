import {
  Controller,
  UseGuards,
  Get,
  Param,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { ChartsListService } from './charts-list.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CreateChartListDto } from './dto/create-chartList.dto';

@Controller('charts-list')
export class ChartsListController {
  constructor(private readonly chartsListService: ChartsListService) {}

  //GET ALL BY USER ID
  @UseGuards(AuthenticatedGuard)
  @Get()
  getAllUserChartsLists(@Request() { user }) {
    return this.chartsListService.getAllUsersLists(user);
  }

  //CREATE
  @UseGuards(AuthenticatedGuard)
  @Post('create')
  createCharsList(
    @Request() { user },
    @Body() createChartListDto: CreateChartListDto,
  ) {
    return this.chartsListService.createChartsList(user, createChartListDto);
  }

  //DELETE
  @UseGuards(AuthenticatedGuard)
  @Get('/delete/:id')
  deleteChartsList(@Request() { user }, @Param('id') id: number) {
    return this.chartsListService.deleteChartList(user, id);
  }

  //UPDATE
  @UseGuards(AuthenticatedGuard)
  @Post('update')
  updateChartList(
    @Request() { user },
    @Body()
    {
      listId,
      charts,
      descriptions,
    }: { listId: number; charts: string; descriptions: string },
  ) {
    return this.chartsListService.updateList(
      user,
      listId,
      charts,
      descriptions,
    );
  }

  //CHART TO USER
  @UseGuards(AuthenticatedGuard)
  @Post('to-user')
  chartToUser(
    @Request() { user },
    @Body() { chartId, userId }: { chartId: number; userId: number },
  ) {
    this.chartsListService.chartToUser(user, chartId, userId);
  }
}
