import {
  Controller,
  UseGuards,
  Get,
  Post,
  Request,
  Body,
  HttpCode,
  Header,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) {}

  //GET ALL
  @UseGuards(AuthenticatedGuard)
  @Get()
  getAllDepartments() {
    return this.departmentService.allDepartments();
  }

  //CREATE
  @UseGuards(AuthenticatedGuard)
  @Post('create')
  @Header('Content-type', 'application/json')
  createDepartment(
    @Request() { user },
    @Body() createDepartmentDto: CreateDepartmentDto,
  ) {
    return this.departmentService.createDepartment(user, createDepartmentDto);
  }

  //DELETE
  @UseGuards(AuthenticatedGuard)
  @Get('delete/:id')
  deleteDepartment(@Param('id') id: string, @Request() { user }) {
    return this.departmentService.deleteDepartment(+id, user);
  }

  //UPDATE
  @UseGuards(AuthenticatedGuard)
  @Post('update/:id')
  updateDepartament(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Param('id') id: string,
    @Request() { user },
  ) {
    return this.departmentService.updateDepartament(
      +id,
      user,
      createDepartmentDto,
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
    return this.departmentService.addMainPattern(section_id, pattern_id, user);
  }
  //ADD PATTERN
  @UseGuards(AuthenticatedGuard)
  @Post('addPattern')
  addPattern(
    @Body()
    { section_id, pattern_id }: { section_id: number; pattern_id: number },
    @Request() { user },
  ) {
    return this.departmentService.addPattern(section_id, pattern_id, user);
  }
  //DEL PATTERN
  @UseGuards(AuthenticatedGuard)
  @Post('delPattern')
  delPattern(
    @Body()
    { section_id, pattern_id }: { section_id: number; pattern_id: number },
    @Request() { user },
  ) {
    return this.departmentService.delPattern(section_id, pattern_id, user);
  }
}
