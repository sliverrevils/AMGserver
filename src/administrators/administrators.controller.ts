import {
  Body,
  Controller,
  Header,
  Post,
  Request,
  UseGuards,
  Param,
  Get,
} from '@nestjs/common';
import { AdministratorsService } from './administrators.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CreateAdministratorDto } from './dto/create-administrator.dto';

@Controller('administrators')
export class AdministratorsController {
  constructor(private readonly administratorsServise: AdministratorsService) {}

  //FIND BY SECTION ID
  @UseGuards(AuthenticatedGuard)
  @Get(`all_in_section/:id`)
  allBySectionId(@Request() { user }, @Param('id') id: number) {
    return this.administratorsServise.findBySectionId(id, user);
  }
  //FIND BY USER ID
  @UseGuards(AuthenticatedGuard)
  @Get(`user/:id`)
  allByUserId(@Request() { user }, @Param('id') id: number) {
    return this.administratorsServise.findByUserId(id);
  }

  //CREATE
  @UseGuards(AuthenticatedGuard)
  @Post('create')
  @Header('Content-type', 'application/json')
  createAdministrator(
    @Request() { user },
    @Body() createAdministratorDto: CreateAdministratorDto,
  ) {
    return this.administratorsServise.createAdministrator(
      user,
      createAdministratorDto,
    );
  }

  //DELETE
  @UseGuards(AuthenticatedGuard)
  @Get('delete/:id') //ADMINISTRATOR_ID
  deleteAdministrator(@Request() { user }, @Param('id') id: number) {
    return this.administratorsServise.deleteAdministrator(user, id);
  }

  //ADD CHART
  @UseGuards(AuthenticatedGuard)
  @Post('add_chart/:id') //ADMIN ID
  addChart(@Request() { user }, @Param('id') id: number, @Body() { chart_id }) {
    return this.administratorsServise.addChart(id, +chart_id, user);
  }
  //DELETE CHART
  @UseGuards(AuthenticatedGuard)
  @Post('delete_chart/:id') //ADMIN ID
  deleteChart(
    @Request() { user },
    @Param('id') id: number,
    @Body() { chart_id },
  ) {
    return this.administratorsServise.deleteChart(id, chart_id, user);
  }
}
