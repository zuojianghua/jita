'use strict';
const data = require('./Blueprint.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Blueprints', data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Blueprints', null, {});
  }
};
