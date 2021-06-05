const Sequelize = require('sequelize');
const User = require('./user');
const File = require('./file');
const Folder = require('./folder');
const Code = require('./code');
const Comment = require('./comment'); 
const Team = require('./team');
const User_Team = require('./user_team'); 

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
db.User = User;
db.Folder = Folder;
db.File = File;
db.Code = Code; 
db.Comment= Comment; 
db.Team = Team; 
db.User_Team= User_Team

// 테이블 실제로 생성
User.init(sequelize);
File.init(sequelize);
Folder.init(sequelize); 
Code.init(sequelize);
Comment.init(sequelize); 
Team.init(sequelize); 
User_Team.init(sequelize);

// 관계 설정
User.associate(db);
File.associate(db);
Folder.associate(db);
Code.associate(db);
Comment.associate(db); 
Team.associate(db); 

module.exports = db;
