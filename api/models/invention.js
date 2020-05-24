'use strict';
module.exports = (sequelize, DataTypes) => {
  const Invention = sequelize.define('Invention', {
    BlueId: DataTypes.INTEGER,    // 蓝图ID
    core1: DataTypes.INTEGER,     // 核心
    core1num: DataTypes.INTEGER,  // 核心数量
    core2: DataTypes.INTEGER,     // 核心
    core2num: DataTypes.INTEGER,  // 核心数量
    decoder: DataTypes.INTEGER,   // 解码器
    rate: DataTypes.DOUBLE,       // 发明成功率
    output: DataTypes.DOUBLE      // T2蓝图的流程数量
  }, {});
  Invention.associate = function(models) {
    // associations can be defined here
    models.Invention.belongsTo(models.Item, { foreignKey: 'BlueId' });

    models.Invention.belongsTo(models.Item, { foreignKey: 'core1', as: 'Core1Item' });
    models.Invention.belongsTo(models.Item, { foreignKey: 'core2', as: 'Core2Item' });
    models.Invention.belongsTo(models.Item, { foreignKey: 'decoder', as: 'DecoderItem' });
  };
  return Invention;
};