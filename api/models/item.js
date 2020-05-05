'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    fav: DataTypes.BOOLEAN,
    blue: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    saleprice: DataTypes.FLOAT,
    buyprice: DataTypes.FLOAT
  }, {});
  Item.associate = function (models) {
    // associations can be defined here
    models.Item.hasMany(models.Blueprint, { foreignKey: 'BlueId' })
  };
  return Item;
};