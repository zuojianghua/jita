'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Materials', null, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Materials', null, {});
  }
};
