'use strict';
module.exports = (sequelize, DataTypes) => {
  const Blueprint = sequelize.define('Blueprint', {
    BlueId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER,
    input: DataTypes.DOUBLE,
    output: DataTypes.DOUBLE
  }, {});
  Blueprint.associate = function (models) {
    // associations can be defined here
    models.Blueprint.belongsTo(models.Item, { foreignKey: 'BlueId' });
    models.Blueprint.belongsTo(models.Item, { foreignKey: 'ItemId', as: 'SubItem' });
  };
  return Blueprint;
};