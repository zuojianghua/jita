jita
====
npx sequelize-cli db:migrate:undo:all & npx sequelize-cli db:migrate & npx sequelize-cli db:seed:all

npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo:all

npx sequelize-cli model:generate --name Item --attributes fav:BOOLEAN,name:STRING,saleprice:FLOAT,buyprice:FLOAT,makeprice:FLOAT,invprice:FLOAT
npx sequelize-cli seed:generate --name Item

npx sequelize-cli model:generate --name Blueprint --attributes BlueId:INTEGER,ItemId:INTEGER,input:INTEGER,output:INTEGER
npx sequelize-cli seed:generate --name Blueprint

npx sequelize-cli model:generate --name Material --attributes BlueId:INTEGER,ItemId:INTEGER,input:DOUBLE
npx sequelize-cli seed:generate --name Material

npx sequelize-cli model:generate --name Invention --attributes BlueId:INTEGER,core1:INTEGER,core1num:INTEGER,core2:INTEGER,core2num:INTEGER,decoder:INTEGER,rate:DOUBLE,output:DOUBLE
npx sequelize-cli seed:generate --name Invention

# TODO LIST
## 原料部分
* [X] 原料从蓝图导入
* [X] 原料继续拆分
* [X] 回写成本价
* [] 利润计算
* [] 发明蓝图成本
## 生产计划
* [X] 生产计划列表
* [X] 原料统计导出

# DB
// /Users/zuojianghua/Code/jita/api/database/database.sqlite
// C:/code/jita/api/database/database.sqlite