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

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  //GET ALL
  @UseGuards(AuthenticatedGuard)
  @Get()
  getAllSections() {
    return this.sectionsService.allSections();
  }
  //CREATE
  @UseGuards(AuthenticatedGuard)
  @Post('create')
  createSection(
    @Body() createSectionDto: CreateSectionDto,
    @Request() { user },
  ) {
    return this.sectionsService.createSection(createSectionDto, user);
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
}
