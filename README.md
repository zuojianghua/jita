jita
====
npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo:all

npx sequelize-cli model:generate --name Item --attributes iid:INTEGER,name:STRING,saleprice:FLOAT,buyprice:FLOAT
npx sequelize-cli seed:generate --name Item