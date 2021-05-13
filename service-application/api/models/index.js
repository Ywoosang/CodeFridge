const Sequelize = require('sequelize');
const User = require('./user');
const File = require('./file');
const Folder = require('./folder');

const db = {};
const sequelize = new Sequelize(
  'CLOUDE', 'root', '123', {
      host : process.env.DATABASE_HOST || '127.0.0.1',
      port : 3306,
      dialect: 'mysql',
  },
);
/*
     host: process.env.DATABASE_HOST || '127.0.0.1',
        user: 'root',
        password: '123',
        database: 'CLOUDE',
	    port: 3306
*/
db.sequelize = sequelize;
db.Folder = Folder;
db.User = User;
db.File = File;

// 테이블 실제로 생성
User.init(sequelize);
File.init(sequelize);
Folder.init(sequelize); 

User.associate(db);
File.associate(db);
Folder.associate(db);

module.exports = db;
