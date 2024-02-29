import { Injectable } from '@nestjs/common';
import { where } from 'sequelize';
import { AdministratorsService } from 'src/administrators/administrators.service';
import { Chart } from 'src/charts/charts.model';
import { ChartsService } from 'src/charts/charts.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { OfficesService } from 'src/offices/offices.service';
import { PatternsService } from 'src/patterns/patterns.service';
import { SectionsService } from 'src/sections/sections.service';
import { TableStatisticsService } from 'src/table-statistics/table-statistics.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class InfoService {
  constructor(
    private readonly usersService: UsersService,
    private readonly officesService: OfficesService,
    private readonly departmentsService: DepartmentsService,
    private readonly sectionsService: SectionsService,
    private readonly administratorsService: AdministratorsService,
    private readonly chartsService: ChartsService,
    private readonly patternsService: PatternsService,
    private readonly tableStatisticsService: TableStatisticsService,
  ) {}

  async fullOrg(user: any): Promise<any | { errorMessage: string }> {
    if (user.role === 'admin' || user.role === 'user') {
      const offices = await this.officesService.allOffices();
      const users = await this.usersService.allUsers();
      const charts = await this.chartsService.getAllCharts();
      const tablePatterns = await this.patternsService.getAllPatterns();
      const officesWithDepartments = await Promise.all(
        offices.map(
          async ({
            id,
            name,
            leadership,
            descriptions,
            ckp,
            mainPattern,
            patterns,
          }) => ({
            id,
            name,
            leadership,
            descriptions,
            ckp,
            mainPattern,
            patterns: JSON.parse(patterns),
            departments: await this.departmentsService.findByOfficeId(id),
          }),
        ),
      );

      const officesWithDepartmentsAndSections = await Promise.all(
        officesWithDepartments.map(async (el) => ({
          ...el,
          departments: await Promise.all(
            el.departments.map(
              async ({
                id,
                office_id,
                name,
                code,
                leadership,
                descriptions,
                ckp,
                mainPattern,
                patterns,
              }) => ({
                id,
                office_id,
                name,
                code,
                leadership,
                descriptions,
                ckp,
                mainPattern,
                patterns: JSON.parse(patterns),
                sections: await this.sectionsService.findByDepartmentId(id),
              }),
            ),
          ),
        })),
      );

      const officesWithDepartmentsAndSectionsAndAdmins = await Promise.all(
        officesWithDepartmentsAndSections.map(async (office) => ({
          ...office,
          departments: await Promise.all(
            office.departments.map(async (department) => ({
              ...department,
              sections: await Promise.all(
                department.sections.map(
                  async ({
                    id,
                    office_id,
                    department_id,
                    name,
                    ckp,
                    descriptions,
                    leadership,
                    mainPattern,
                    patterns,
                  }) => ({
                    id,
                    office_id,
                    department_id,
                    name,
                    ckp,
                    mainPattern,
                    patterns: JSON.parse(patterns),
                    descriptions,
                    leadership,
                    administrators:
                      await this.administratorsService.findBySectionId(id),
                  }),
                ),
              ),
            })),
          ),
        })),
      );
      return {
        patterns: charts,
        users,
        offices: officesWithDepartmentsAndSectionsAndAdmins,
        tablePatterns,
        tableStatistics: (await this.tableStatisticsService.getAll()).map(
          (table) => ({ ...table, dateColumn: JSON.parse(table.dateColumn) }),
        ),
      };
    } else {
      return { errorMessage: 'Требуются права администратора' };
    }
  }

  //Charts patterns array from user ID
  async userAllChartPatterns(id: number): Promise<Array<Chart>> {
    const admins = await this.administratorsService.findByUserId(id);
    if (Array.isArray(admins)) {
      const charts = admins.reduce(
        (acc, admin) => [...acc, ...JSON.parse(admin.charts)],
        [],
      );

      const patternsIdsArr = Array.from(new Set(charts));
      const patternsArr = await Promise.all(
        patternsIdsArr.map(
          async (patternID: number) =>
            await this.chartsService.findOneById(patternID),
        ),
      );

      return patternsArr.filter((el) => el);
    }
    return [];
  }

  //RAPORT LIST
  async getRaportList(statIdArr: number[]): Promise<any[]> {
    let parsedRepArr: any[] = [];
    if (statIdArr.length) {
      const allStats = await this.tableStatisticsService.getAll();
      const repArr = allStats.filter(({ id }) => statIdArr.includes(id));
      if (repArr.length) {
        parsedRepArr = repArr.map((stat) => ({
          ...stat,
          dateColumn: JSON.parse(stat.dateColumn),
        }));
      }
    }
    return parsedRepArr;
  }
}
