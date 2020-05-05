const { Item, Sequelize } = require('./models')
const { Op } = Sequelize;

Item.findAll({
    where: { id: { [Op.lte]: 120 } }
}).then(result => {
    console.log(result.map(m => m.dataValues))
})