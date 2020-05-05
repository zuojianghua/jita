'use strict';
module.exports = (sequelize, DataTypes) => {
  const Blueprint = sequelize.define('Blueprint', {
    BlueId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER,
    input: DataTypes.INTEGER,
    output: DataTypes.INTEGER
  }, {});
  Blueprint.associate = function (models) {
    // associations can be defined here
    models.Blueprint.belongsTo(models.Item, { foreignKey: 'BlueId' });
    models.Blueprint.belongsTo(models.Item, { foreignKey: 'ItemId', as: 'SubItem' });
  };
  return Blueprint;
};