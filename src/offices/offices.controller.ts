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

  //PATTERNS
  //ADD MAIN PATTERN
  @UseGuards(AuthenticatedGuard)
  @Post('addMainPattern')
  addMainPattern(
    @Body()
    { section_id, pattern_id }: { section_id: number; pattern_id: number },
    @Request() { user },
  ) {
    return this.officesService.addMainPattern(section_id, pattern_id, user);
  }
  //ADD PATTERN
  @UseGuards(AuthenticatedGuard)
  @Post('addPattern')
  addPattern(
    @Body()
    { section_id, pattern_id }: { section_id: number; pattern_id: number },
    @Request() { user },
  ) {
    return this.officesService.addPattern(section_id, pattern_id, user);
  }
  //DEL PATTERN
  @UseGuards(AuthenticatedGuard)
  @Post('delPattern')
  delPattern(
    @Body()
    { section_id, pattern_id }: { section_id: number; pattern_id: number },
    @Request() { user },
  ) {
    return this.officesService.delPattern(section_id, pattern_id, user);
  }
}
