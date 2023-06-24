const { faker } = require('@faker-js/faker');
('use strict');

const conditions = ['НД', 'ЧП'];
const department = ['АС', 'НО', 'РО', 'ГД', 'РС'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //-----------------------------------GENERATING FAKE DATA
    return queryInterface.bulkInsert(
      'Charts',
      new Array(10).fill().map(() => ({
        interval: faker.date.between({
          from: '2022-01-01T00:00:00.000Z',
          to: '2023-01-01T00:00:00.000Z',
        }),
        reg_stat_sum: faker.number.int({ min: 120, max: 150 }),
        growing_sum: faker.number.int({ min: 50, max: 150 }),
        week_condition:
          conditions[Math.floor(Math.random() * conditions.length)],
        week_3_condition:
          conditions[Math.floor(Math.random() * conditions.length)],
        status_trend: conditions[Math.floor(Math.random() * conditions.length)],
        delta: faker.number.int({ min: -100, max: 100 }),
        created_by: faker.number.int({ min: 1, max: 10 }),
        creator_department:
          department[Math.floor(Math.random() * department.length)],
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Charts', null, {});
  },
};
