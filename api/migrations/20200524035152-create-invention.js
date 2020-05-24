'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Inventions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BlueId: {
        type: Sequelize.INTEGER
      },
      core1: {
        type: Sequelize.INTEGER
      },
      core1num: {
        type: Sequelize.INTEGER
      },
      core2: {
        type: Sequelize.INTEGER
      },
      core2num: {
        type: Sequelize.INTEGER
      },
      decoder: {
        type: Sequelize.INTEGER
      },
      rate: {
        type: Sequelize.DOUBLE
      },
      output: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Inventions');
  }
};