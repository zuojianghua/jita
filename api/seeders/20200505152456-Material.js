'use strict';
const data = require('./Material.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Materials', data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Materials', null, {});
  }
};
