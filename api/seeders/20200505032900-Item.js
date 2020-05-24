'use strict';
const xlsx = require('node-xlsx');
const sheets = xlsx.parse('./database.xls');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const datas = [];
    const times = new Date();

    sheets.forEach(function (sheet) {
      if (sheet['name'] == '物品列表') {
        for (var rowId in sheet['data']) {
          if (rowId == 0) continue;
          const row = sheet['data'][rowId];
          datas.push({
            id: sheet['data'][rowId][0],
            fav: false,
            blue: false,
            name: sheet['data'][rowId][1],
            saleprice: 0,
            buyprice: 0,
            makeprice: 0,
            invprice: 0,
            createdAt: times,
            updatedAt: times
          })
        }
      }
    })
    return queryInterface.bulkInsert('Items', datas, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Items', null, {});
  }
};
