'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Charts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      interval: {
        type: Sequelize.STRING,
      },
      reg_stat_sum: {
        type: Sequelize.INTEGER,
      },
      growing_sum: {
        type: Sequelize.INTEGER,
      },
      week_condition: {
        type: Sequelize.STRING,
      },
      week_3_condition: {
        type: Sequelize.STRING,
      },
      status_trend: {
        type: Sequelize.STRING,
      },
      delta: {
        type: Sequelize.INTEGER,
      },
      created_by: {
        type: Sequelize.STRING,
      },
      creator_department: {
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Charts');
  },
};
