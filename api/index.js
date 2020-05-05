// 伏尔戈星系 10000002
// 海四空间站 60003760

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
var _ = require('lodash');

const { Item, Blueprint, Sequelize } = require('./models')
const { Op } = Sequelize;

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/items', function (req, res) {
    const { pi, ps, name } = req.query;
    let where = {}
    if (name) where.name = { [Op.substring]: name.trim() }
    Item.findAndCountAll({
        where,
        offset: (pi - 1) * ps,
        limit: ps,
    }).then(result => {
        res.json(result)
    })
});

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

app.get('/fav/:id', function (req, res) {
    const { id } = req.params;
    Item.findByPk(id).then(item => {
        item.update({ fav: !item.fav }).then(() => res.json(true))
    })
})

app.post('/addBlueprint/:id', async function (req, res) {
    const { id } = req.params;
    const { num, data } = req.body;
    // console.log(num, data);

    const insertData = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const item = await Item.findOne({ where: { name: element[0] }, attributes: ['id'] });
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

app.listen(3000, () => console.log(`Example app listening on port 3000!`))