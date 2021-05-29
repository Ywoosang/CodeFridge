const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
      },
      nickname: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: '익명이'
      },
      password: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'local',
      },
      authId: {
        type: Sequelize.STRING(20),
        allowNull:true
      },
      nickId : {
        type: Sequelize.STRING(20),
        allowNull: false,
        // 랜덤 값 생성 
        defaultValue : Math.random().toString(36).substr(2,11),
      }
    }, {
      sequelize,
      // createdAt 
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
      db.User.hasMany(db.Folder,{
          foreignKey: 'ownerId'
      });
      db.User.hasMany(db.File,{
          foreignKey: 'ownerId'
      });
      db.User.hasMany(db.Comment,{
        foreignKey : 'ownerId',
        onDelete : 'CASCADE',
      })
      db.User.belongsToMany(db.Team, { through: 'User_Team' });
 }
};
