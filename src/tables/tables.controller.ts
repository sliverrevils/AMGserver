import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CreateTableDto } from './dto/create-table.dto';
import { UserI } from 'src/auth/types/typesAuth';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @UseGuards(AuthenticatedGuard)
  @Get(`all/:id`)
  allByPatternId(@Param('id') id: number, @Request() { user }) {
    return this.tablesService.allByPatternId(id);
  }

  @UseGuards(AuthenticatedGuard)
  @Post(`create`)
  createTable(@Body() createTableDto: CreateTableDto, @Request() { user }) {
    return this.tablesService.createTable(user, createTableDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Post(`delete/:id`)
  deleteTableById(
    @Param('id') id: number,
    @Request() { user }: { user: UserI },
    @Body() body: { view_pattern_id: number },
  ) {
    return this.tablesService.deleteTable(user, id, body.view_pattern_id);
  }
}
