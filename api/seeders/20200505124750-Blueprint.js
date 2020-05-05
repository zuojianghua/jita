'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Blueprints', null, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Blueprints', null, {});
  }
};
