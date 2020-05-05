jita
====
npx sequelize-cli db:migrate:undo:all & npx sequelize-cli db:migrate & npx sequelize-cli db:seed:all

npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo:all

npx sequelize-cli model:generate --name Item --attributes fav:BOOLEAN,name:STRING,saleprice:FLOAT,buyprice:FLOAT
npx sequelize-cli seed:generate --name Item

npx sequelize-cli model:generate --name Blueprint --attributes BlueId:INTEGER,ItemId:INTEGER,input:INTEGER,output:INTEGER
npx sequelize-cli seed:generate --name Blueprint