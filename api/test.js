const { Item, Material, Blueprint, Sequelize } = require('./models')
const { Op } = Sequelize;
const fs = require('fs');

// Item.findAll({
//     where: { id: { [Op.lte]: 120 } }
// }).then(result => {
//     console.log(result.map(m => m.dataValues))
// })


// Material.findAll().then(result => {
//     console.log(result)
// })

Blueprint.findAll().then(result => {
    const txt = JSON.stringify(result.map(m => m.dataValues))
    fs.writeFile('./seeders/Blueprint.json', txt, 'utf8', (err) => {
        if (err) console.log(err);
        console.log('The file has been saved!');
    });
})


var crypto = require('crypto');
const pass = crypto.createHash('md5').update('123456').digest('hex');
console.log(pass)