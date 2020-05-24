'use strict';
const data = require('./Invention.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Inventions', data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Inventions', null, {});
  }
};
