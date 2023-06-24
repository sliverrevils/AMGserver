'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chart.init(
    {
      interval: DataTypes.STRING,
      reg_stat_sum: DataTypes.INTEGER,
      growing_sum: DataTypes.INTEGER,
      week_condition: DataTypes.STRING,
      week_3_condition: DataTypes.STRING,
      status_trend: DataTypes.STRING,
      delta: DataTypes.INTEGER,
      created_by: DataTypes.STRING,
      creator_department: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Charts',
    },
  );
  return Chart;
};
