import {
  Controller,
  UseGuards,
  Get,
  Body,
  Request,
  Post,
  Param,
} from '@nestjs/common';
import { TableStatisticsService } from './table-statistics.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CreateTableStatisticDto } from './dto/create-tablestatistic.dto';

@Controller('table-statistics')
export class TableStatisticsController {
  constructor(private readonly tableStatisticService: TableStatisticsService) {}

  //GET ALL
  @UseGuards(AuthenticatedGuard)
  @Get()
  getAllTableStatistics() {
    return this.tableStatisticService.getAll();
  }
  @UseGuards(AuthenticatedGuard)
  @Get('/:id')
  getById(@Param('id') id: number) {
    return this.tableStatisticService.getById(id);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('create')
  createTableStatistic(
    @Body() createTableStatisticDto: CreateTableStatisticDto,
    @Request() { user },
  ) {
    return this.tableStatisticService.createTableStatistic(
      user,
      createTableStatisticDto,
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Post('update/:id')
  updateTableStatistic(
    @Body() createTableStatisticDto: CreateTableStatisticDto,
    @Request() { user },
    @Param('id') statId: number,
  ) {
    return this.tableStatisticService.updateTableStatistic(
      statId,
      user,
      createTableStatisticDto,
    );
  }
  @UseGuards(AuthenticatedGuard)
  @Get('delete/:id')
  deleteTableStatistic(@Request() { user }, @Param('id') statId: number) {
    return this.tableStatisticService.deleteTableStatistic(statId, user);
  }
}
