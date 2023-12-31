import { Injectable } from '@nestjs/common';
import { AdministratorsService } from 'src/administrators/administrators.service';
import { Chart } from 'src/charts/charts.model';
import { ChartsService } from 'src/charts/charts.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { OfficesService } from 'src/offices/offices.service';
import { SectionsService } from 'src/sections/sections.service';
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
  ) {}

  async fullOrg(user: any): Promise<any | { errorMessage: string }> {
    if (user.role === 'admin' || user.role === 'user') {
      const offices = await this.officesService.allOffices();
      const users = await this.usersService.allUsers();
      const charts = await this.chartsService.getAllCharts();
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

      // const patternAccesses = officesWithDepartmentsAndSectionsAndAdmins.reduce(
      //   (acc, office, idx) => {
      //     const addPatterns = (currentPatterns: number[], patterns: number[]) => [...new Set([...currentPatterns, ...patterns])];
      //     const officePatterns = addPatterns([office.mainPattern], office.patterns).filter(pat => !!pat);
      //     if (office.leadership) {
      //       acc[office.leadership] = addPatterns(officePatterns, acc[office.leadership] || [])
      //     }
      //     office.departments.forEach(department => {
      //       const departmentPatterns = addPatterns([department.mainPattern], department.patterns).filter(pat => !!pat);
      //       if (department.leadership) {
      //         acc[department.leadership] = addPatterns(acc[department.leadership] || [], departmentPatterns)
      //       }
      //       if (office.leadership) {
      //         acc[office.leadership] = addPatterns(departmentPatterns, acc[office.leadership] || [])
      //       }

      //       department.sections.forEach(section => {
      //         const sectionPatterns = addPatterns([section.mainPattern], section.patterns).filter(pat => !!pat);

      //         if (department.leadership) {
      //           acc[department.leadership] = addPatterns(acc[department.leadership] || [], sectionPatterns)
      //         }
      //         if (office.leadership) {
      //           acc[office.leadership] = addPatterns(sectionPatterns, acc[office.leadership] || [])
      //         }
      //         if (section.leadership) {
      //           acc[section.leadership] = addPatterns(sectionPatterns, acc[section.leadership] || [])
      //         }

      //       })

      //     })
      //     return acc;
      //   },
      //   {},
      // );
      return {
        patterns: charts,
        users,
        offices: officesWithDepartmentsAndSectionsAndAdmins,
        //patternAccesses,
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
}
