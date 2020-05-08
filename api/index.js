// 伏尔戈星系 10000002
// 海四空间站 60003760

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
var _ = require('lodash');

const { Item, Blueprint, Material, Sequelize, sequelize } = require('./models')
const { Op } = Sequelize;

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 物品列表
app.get('/items', function (req, res) {
    const { pi, ps, name, fav, blue } = req.query;
    let where = {}
    if (name) where.name = { [Op.substring]: name.trim() }
    if (fav && JSON.parse(fav)) where.fav = true;
    if (blue && JSON.parse(blue)) where.blue = true;

    Item.findAndCountAll({
        where,
        offset: (pi - 1) * ps,
        limit: ps,
    }).then(result => {
        res.json(result)
    })
});

// 更新物品价格
app.get('/updatePrice/:id', function (req, res) {
    const { id } = req.params;
    const url = `https://esi.evepc.163.com/latest/markets/10000002/orders/?datasource=serenity&order_type=sell&page=1&type_id=${id}`;
    const url2 = `https://esi.evepc.163.com/latest/markets/10000002/orders/?datasource=serenity&order_type=buy&page=1&type_id=${id}`;
    request(url, function (error, response, body) {
        // console.error('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        if (!response || response.statusCode != 200) return res.json(false);
        const result = JSON.parse(body);
        const price = result.filter(f => f.location_id == '60003760');
        const sortPrice = _.sortBy(price, ['price']);
        if (sortPrice.length > 0) {
            // console.log(sortPrice)
            const minPrice = sortPrice[0].price;
            Item.findByPk(id).then(item => {
                item.update({ saleprice: minPrice }).then(() => res.json(minPrice))
            })
        }
    });

    request(url2, function (error, response, body) {
        const result = JSON.parse(body);
        if (!response || response.statusCode != 200) return;
        const price = result.filter(f => f.location_id == '60003760');
        const sortPrice = _.sortBy(price, ['price']);
        if (sortPrice.length > 0) {
            const maxPrice = _.last(sortPrice).price;
            Item.findByPk(id).then(item => {
                item.update({ buyprice: maxPrice })
            })
        }
    });
})

// 设为常用物品
app.get('/fav/:id', function (req, res) {
    const { id } = req.params;
    Item.findByPk(id).then(item => {
        item.update({ fav: !item.fav }).then(() => res.json(true))
    })
})

// 为物品登记蓝图
app.post('/addBlueprint/:id', async function (req, res) {
    const { id } = req.params;
    const { num, data } = req.body;
    // console.log(num, data);

    const insertData = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const item = await Item.findOne({ where: { name: element[0] }, attributes: ['id'] });
        if (!item) continue
        insertData.push({
            BlueId: id,
            ItemId: item.id,
            input: element[1],
            output: num,
        })
    }

    // 清除原有蓝图
    await Blueprint.destroy({ where: { BlueId: id }, force: true });
    await Item.findByPk(id).then(item => item.update({ blue: true }));
    await Blueprint.bulkCreate(insertData).then(() => {
        res.json(true)
    })

    console.log(insertData)
})

// 获取物品蓝图信息
app.get('/getBlueprint/:id', function (req, res) {
    const { id } = req.params;
    Item.findByPk(id, {
        include: [
            { model: Blueprint, include: [{ model: Item, as: 'SubItem' }] }
        ]
    }).then(result => {
        res.json(result)
    })
})

// 获取物品材料信息
app.get('/getMaterial/:id', function (req, res) {
    const { id } = req.params;
    Material.findAll({
        where: { BlueId: id },
        include: [{ model: Item, as: 'SubItem' }],
    }).then(result => {
        res.json(result)
    })
})

// 从蓝图导入材料或重置材料
app.get('/resetMaterial/:id', async function (req, res) {
    const { id } = req.params;
    // 清除原有的材料信息
    await Material.destroy({ where: { BlueId: id }, force: true });
    // 找到蓝图材料
    const items = await Blueprint.findAll({ where: { BlueId: id } });
    // console.log(items);
    const data = items.map(m => ({
        BlueId: m.BlueId,
        ItemId: m.ItemId,
        input: m.input / m.output
    }))
    await Material.bulkCreate(data).then(() => {
        res.json(true)
    })
})

// 拆分某项材料
app.get('/splitMaterial/:id/:subid', async function (req, res) {
    const { id, subid } = req.params;
    // 找到当前这条材料的信息
    const thisMaterial = await Material.findByPk(subid);
    // 找到当前物品的全部材料
    const materials = await Material.findAll({ where: { BlueId: id } });
    // 找到subid的蓝图信息
    const items = await Blueprint.findAll({ where: { BlueId: thisMaterial.ItemId } });
    const data = items.map(m => ({
        BlueId: thisMaterial.BlueId,
        ItemId: m.ItemId,
        input: (m.input / m.output) * thisMaterial.input
    }))
    // 根据materials数组内的ItemId判断是新的材料还是已有的材料
    const oldData = data.filter(f => materials.map(m => m.dataValues.ItemId).includes(f.ItemId))
    const newData = data.filter(f => !materials.map(m => m.dataValues.ItemId).includes(f.ItemId))
    // 合并已有的材料
    oldData.forEach(element => {
        const i = materials.findIndex(v => v.ItemId == element.ItemId);
        materials[i].dataValues.input = materials[i].dataValues.input + element.input;
    });
    const updateData = materials.map(m => m.dataValues);
    await Material.bulkCreate(updateData, { updateOnDuplicate: ['input'] });
    // 追加到id的材料库
    console.log(newData)
    await Material.bulkCreate(newData);
    // 删除subid
    await thisMaterial.destroy({ force: true });
    res.json(true);
})

// 计算制造成本并回写
app.get('/compPrice/:id', async function (req, res) {
    const { id } = req.params;
    // 找到蓝图材料
    const items = await Material.findAll({
        where: { BlueId: id },
        include: [{ model: Item, as: 'SubItem' }],
    })
    let price = 0;
    items.forEach(i => {
        price = price + (i.input * i.SubItem.saleprice)
    })

    await Item.update({ makeprice: price }, { where: { id } }).then(() => {
        res.json(true);
    })
})


app.listen(3000, () => console.log(`Example app listening on port 3000!`))

// 刷新蓝图状态
Blueprint.findAll({attributes:[
    [sequelize.fn('distinct', sequelize.col('BlueId')), 'BlueId']
]}).then((result)=>{
    const ids = result.map(m=>m.dataValues.BlueId)
    Item.update({blue:true},{where:{id:{
        [Op.in]: ids,
    }}})
})