import {
  Controller,
  Get,
  UseGuards,
  Post,
  Request,
  Body,
  Param,
} from '@nestjs/common';
import { SectionsService } from './sections.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CreateSectionDto } from './dto/create-section.dto';
import { AddAdministratorDto } from './dto/add-administrator.dto';
import { CreateDivisionDto } from './dto/create-division.dto';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  //GET ALL
  @UseGuards(AuthenticatedGuard)
  @Get()
  getAllSections() {
    return this.sectionsService.allSections();
  }
  //CREATE SECTION
  @UseGuards(AuthenticatedGuard)
  @Post('create')
  createSection(
    @Body() createSectionDto: CreateSectionDto,
    @Request() { user },
  ) {
    return this.sectionsService.createSection(createSectionDto, user);
  }
  //CREATE DIVISION
  @UseGuards(AuthenticatedGuard)
  @Post('create-division')
  createDivision(
    @Body() createDivisionDto: CreateDivisionDto,
    @Request() { user },
  ) {
    return this.sectionsService.createDivision(createDivisionDto, user);
  }

  //DELETE
  @UseGuards(AuthenticatedGuard)
  @Get('delete/:id')
  deleteSection(@Param('id') id: string, @Request() { user }) {
    return this.sectionsService.deleteSection(+id, user);
  }
  //UPDATE
  @UseGuards(AuthenticatedGuard)
  @Post('update/:id')
  updateSection(
    @Body() createSectionDto: CreateSectionDto,
    @Param('id') id: string,
    @Request() { user },
  ) {
    return this.sectionsService.updateSection(+id, createSectionDto, user);
  }
  //ADD ADMINISTRATOR
  @UseGuards(AuthenticatedGuard)
  @Post('add_administrator/:id')
  addAdministrator(
    @Body() addAdministratorDto: AddAdministratorDto,
    @Param('id') id: string,
    @Request() { user },
  ) {
    return this.sectionsService.addAdministrator(
      +id,
      addAdministratorDto,
      user,
    );
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
    return this.sectionsService.addMainPattern(section_id, pattern_id, user);
  }
  //ADD PATTERN
  @UseGuards(AuthenticatedGuard)
  @Post('addPattern')
  addPattern(
    @Body()
    { section_id, pattern_id }: { section_id: number; pattern_id: number },
    @Request() { user },
  ) {
    return this.sectionsService.addPattern(section_id, pattern_id, user);
  }
  //DEL PATTERN
  @UseGuards(AuthenticatedGuard)
  @Post('delPattern')
  delPattern(
    @Body()
    { section_id, pattern_id }: { section_id: number; pattern_id: number },
    @Request() { user },
  ) {
    return this.sectionsService.delPattern(section_id, pattern_id, user);
  }
}
