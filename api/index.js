// 伏尔戈星系 10000002
// 海四空间站 60003760

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
const compression = require('compression');
var _ = require('lodash');
var crypto = require('crypto');

const { Item, Blueprint, Material, Sequelize, sequelize } = require('./models')
const { Op } = Sequelize;

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

app.post('/login/account', function (req, res) {
    const data = req.body;
    const pass = crypto.createHash('md5').update(data.password).digest('hex');
    console.log(pass)
    if (!(data.userName === 'zuozuo' || data.userName === 'user') || pass !== '7e8b9602c316bb5e07e2aae8771971f7') {
        res.status(400).send(`失败`);
    }
    res.json({
        msg: 'ok',
        user: {
            token: '123456789',
            name: data.userName,
            email: `hahaha@qq.com`,
            id: 10000,
            time: +new Date(),
        },
    })
})

// 物品列表
app.get('/items', function (req, res) {
    const { pi, ps, name, fav, blue } = req.query;
    let where = {}
    if (name) where.name = { [Op.substring]: name.trim() }
    if (fav && JSON.parse(fav)) where.fav = true;
    if (blue && JSON.parse(blue)) where.blue = true;

    console.log('接到请求', where)
    try {
        Item.findAndCountAll({
            where,
            offset: (pi - 1) * ps,
            limit: ps,
            order: [['updatedAt', 'DESC']]
        }).then(result => {
            res.json(result)
        })
    } catch (error) {
        console.log(error)
        res.status(400).send(`请求失败`);
    }

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

// 计算生产计划
app.post('/product', async function (req, res) {
    const data = req.body;
    const dataObj = {};
    // 生成物品=>数量键值对
    data.forEach(d => {
        dataObj[d[0]] = d[1];
    })
    // console.log('键值对', dataObj)
    // 查找商品
    const items = await Item.findAll({
        where: {
            name: { [Op.in]: data.map(m => m[0]) }
        }
    })
    let itemsData = items.map(m => m.dataValues);

    let totalSaleprice = 0;
    itemsData.forEach((v, i) => {
        itemsData[i].num = +dataObj[v.name];
        totalSaleprice = totalSaleprice + (itemsData[i].num * itemsData[i].saleprice);
    })

    // console.log('总价值', totalSaleprice)

    // 查找原材料
    const materials = await Material.findAll({
        where: {
            BlueId: { [Op.in]: itemsData.map(m => m.id) }
        },
        include: [{ model: Item, as: 'SubItem' }],
    })
    let materialsData = materials.map(m => m.dataValues);
    let materialsObj = {}
    materialsData.forEach(m => {
        if (!materialsObj[m.ItemId]) {
            materialsObj[m.ItemId] = m;
            materialsObj[m.ItemId].num = m.input * itemsData.find(f => f.id == m.BlueId).num;
        } else {
            materialsObj[m.ItemId].num = materialsObj[m.ItemId].num + (m.input * itemsData.find(f => f.id == m.BlueId).num);
        }
    })
    let totalBuyprice = 0;
    const outputData = Object.values(materialsObj);
    // console.log(outputData)
    outputData.forEach(m => {
        totalBuyprice = totalBuyprice + (m.num * m.SubItem.dataValues.saleprice);
    })

    res.json({
        totalSaleprice,
        totalBuyprice,
        items: itemsData,
        data: outputData,
    })
})

app.use('/', express.static('app'));
app.listen(3002, () => console.log(`Example app listening on port 3002!`))

// 启动后的任务

// 刷新蓝图状态
Blueprint.findAll({
    attributes: [
        [sequelize.fn('distinct', sequelize.col('BlueId')), 'BlueId']
    ]
}).then((result) => {
    const ids = result.map(m => m.dataValues.BlueId)
    console.log('待刷新蓝图', ids);
    Item.update({ blue: true }, {
        where: {
            id: {
                [Op.in]: ids,
            }
        }
    })
})

// 自动更新内置物品
// 矿物/行星产物/T2组件/冰矿产物/打捞材料/T2原料/发明核心/无人机
const myItems = [
    34, 35, 36, 37, 38, 39, 40, 11399,
    44, 2312, 2317, 2319, 2321, 2327, 2328, 2329, 2344, 2345, 2346, 2348, 2349, 2351, 2352, 2354, 2358, 2360, 2361, 2366, 2367, 2389, 2390, 2392, 2393, 2395, 2396, 2397, 2398, 2399, 2400, 2401, 2463, 2867, 2868, 2869, 2870, 2871, 2872, 2875, 2876, 3645, 3683, 3689, 3691, 3693, 3695, 3697, 3725, 3775, 3779, 3828, 9828, 9830, 9832, 9834, 9836, 9838, 9840, 9842, 9846, 9848, 12836, 15317, 17136, 17392, 17898, 28974,
    11530, 11531, 11532, 11533, 11534, 11535, 11536, 11537, 11538, 11539, 11540, 11541, 11542, 11543, 11544, 11545, 11547, 11548, 11549, 11550, 11551, 11552, 11553, 11554, 11555, 11556, 11557, 11558, 11688, 11689, 11690, 11691, 11692, 11693, 11694, 11695,
    16272, 16273, 16274, 16275, 17887, 17888, 17889,
    25588, 25589, 25590, 25591, 25592, 25593, 25594, 25595, 25596, 25597, 25598, 25599, 25600, 25601, 25602, 25603, 25604, 25605, 25606, 25607, 25608, 25609, 25610, 25611, 25612, 25613, 25614, 25615, 25616, 25617, 25618, 25619, 25620, 25621, 25622, 25623, 25624, 25625, 30018, 30019, 30021, 30022, 30024, 30248, 30251, 30252, 30254, 30258, 30259, 30268, 30269, 30270, 30271,
    16670, 16671, 16672, 16673, 16678, 16679, 16680, 16681, 16682, 16683, 17317, 33359, 33360, 33361, 33362,
    20114, 20115, 20171, 20172, 20410, 20411, 20412, 20413, 20414, 20415, 20416, 20417, 20418, 20419, 20420, 20421, 20423, 20424, 20425, 25887,
    2203, 2205, 2454, 2456, 2464, 2466, 2486, 2488, 2173, 2175, 2183, 2185, 15508, 15510, 21638, 21640, 1201, 2193, 2195, 2436, 2444, 2446, 2476, 2478, 23525, 23559, 23561, 23563, 28209, 28211, 28213, 28215, 10246, 10250, 43699, 43700,
]



// 修复pg自增主键
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];
console.log('当前环境:', env);
const fixPostgres = async () => {
    if (config.dialect != 'postgres') return;
    // 每次服务启动后, 手动检查和修复postgres批量导入数据或拷贝数据后seq自增序列不会更新的问题
    const tb_name = [
        'Items', 'Blueprints', 'Materials',
    ];
    let sql = '';
    for (let index = 0; index < tb_name.length; index++) {
        const element = tb_name[index];
        sql += `SELECT setval('"${element}_id_seq"', (SELECT max(id) FROM "${element}"));`;
    }
    console.log('检查postgres自增序列', sql)
    await sequelize.query(sql);
    // await sequelize.query(`SELECT setval('"GoodsInfos_id_seq"', (SELECT max(id) FROM "GoodsInfos"))`);
    console.log('检查postgres自增序列完毕')
}
fixPostgres()


const updatePirce = (id) => {
    const url = `https://esi.evepc.163.com/latest/markets/10000002/orders/?datasource=serenity&order_type=sell&page=1&type_id=${id}`;
    const url2 = `https://esi.evepc.163.com/latest/markets/10000002/orders/?datasource=serenity&order_type=buy&page=1&type_id=${id}`;
    request(url, function (error, response, body) {
        if (!response || response.statusCode != 200) return;
        const result = JSON.parse(body);
        const price = result.filter(f => f.location_id == '60003760');
        const sortPrice = _.sortBy(price, ['price']);
        if (sortPrice.length > 0) {
            const minPrice = sortPrice[0].price;
            Item.findByPk(id).then(item => {
                item.update({ saleprice: minPrice })
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
}

for (let index = 0; index < myItems.length; index++) {
    const element = myItems[index];
    const t = index*100
    setTimeout(()=>{updatePirce(element)}, t)
}