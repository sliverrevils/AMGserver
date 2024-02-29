import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Request,
  Param,
} from '@nestjs/common';
import { PatternsService } from './patterns.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CreatePatternDto } from './dto/create-pattern.dto';

@Controller('patterns')
export class PatternsController {
  constructor(private readonly patternsService: PatternsService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  getAllPatterns() {
    this.patternsService.getAllPatterns();
  }

  @UseGuards(AuthenticatedGuard)
  @Post('create')
  createPattern(
    @Body() createPatternDto: CreatePatternDto,
    @Request() { user },
  ) {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };

    return this.patternsService.createPattern(createPatternDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('delete/:id')
  deletePattern(@Param() { id }: { id: number }, @Request() { user }) {
    if (user.role !== 'admin')
      return { errorMessage: 'Требуются права администратора' };
    return this.patternsService.deletePattern(id);
  }
}
