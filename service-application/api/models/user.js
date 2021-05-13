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
        type: Sequelize.INTEGER(10),
        allowNull: true,
      },
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
 }
};
