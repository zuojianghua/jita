jita
====
npx sequelize-cli db:migrate:undo:all & npx sequelize-cli db:migrate & npx sequelize-cli db:seed:all

npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo:all

npx sequelize-cli model:generate --name Item --attributes fav:BOOLEAN,name:STRING,saleprice:FLOAT,buyprice:FLOAT,makeprice:FLOAT
npx sequelize-cli seed:generate --name Item

npx sequelize-cli model:generate --name Blueprint --attributes BlueId:INTEGER,ItemId:INTEGER,input:INTEGER,output:INTEGER
npx sequelize-cli seed:generate --name Blueprint

npx sequelize-cli model:generate --name Material --attributes BlueId:INTEGER,ItemId:INTEGER,input:DOUBLE
npx sequelize-cli seed:generate --name Material

//TODO 
# 原料部分
[*] 原料从蓝图导入
[*] 原料继续拆分
* 回写成本价
* 利润计算
* 发明蓝图成本
# 生产计划
* 生产计划列表
* 原料统计导出