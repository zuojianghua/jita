'use strict';
module.exports = (sequelize, DataTypes) => {
  const Material = sequelize.define('Material', {
    BlueId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER,
    input: DataTypes.DOUBLE
  }, {});
  Material.associate = function(models) {
    // associations can be defined here
    models.Material.belongsTo(models.Item, { foreignKey: 'BlueId' });
    models.Material.belongsTo(models.Item, { foreignKey: 'ItemId', as: 'SubItem' });
  };
  return Material;
};