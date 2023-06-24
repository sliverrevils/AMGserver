import {
  Controller,
  UseGuards,
  Post,
  Body,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { OfficesService } from './offices.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CreateOfficeDto } from './dto/create-office.dto';

@Controller('offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  getAllOffices() {
    return this.officesService.allOffices();
  }

  @UseGuards(AuthenticatedGuard)
  @Post('create')
  createOffice(@Body() createOfficeDto: CreateOfficeDto, @Request() { user }) {
    return this.officesService.createOffice(createOfficeDto, user);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('update/:id')
  updateOffice(
    @Body() createOfficeDto: CreateOfficeDto,
    @Param('id') id: string,
    @Request() { user },
  ) {
    return this.officesService.updateOffice(id, createOfficeDto, user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('delete/:id')
  deleteOffice(@Param('id') id: string, @Request() { user }) {
    return this.officesService.deleteOffice(+id, user);
  }
}
