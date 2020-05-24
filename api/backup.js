const { Item, Material, Blueprint, Invention, Sequelize } = require('./models')
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

// 蓝图备份
Blueprint.findAll().then(result => {
    const txt = JSON.stringify(result.map(m => m.dataValues))
    fs.writeFile('./seeders/Blueprint.json', txt, 'utf8', (err) => {
        if (err) console.log(err);
        console.log('蓝图备份完成!');
    });
})

// 原材料备份
Material.findAll().then(result => {
    const txt = JSON.stringify(result.map(m => m.dataValues))
    fs.writeFile('./seeders/Material.json', txt, 'utf8', (err) => {
        if (err) console.log(err);
        console.log('原材料备份完成!');
    });
})

// 发明备份
Invention.findAll().then(result => {
    const txt = JSON.stringify(result.map(m => m.dataValues))
    fs.writeFile('./seeders/Invention.json', txt, 'utf8', (err) => {
        if (err) console.log(err);
        console.log('发明备份完成!');
    });
})

var crypto = require('crypto');
const pass = crypto.createHash('md5').update('123456').digest('hex');
console.log(pass)