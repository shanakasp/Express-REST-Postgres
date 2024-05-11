npx sequelize-cli init

npx sequelize-cli db:create

npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string,password:string,userType:ENUM('admin','user','moderator')

npx sequelize-cli db:migrate

npx sequelize-cli db:migrate:undo
