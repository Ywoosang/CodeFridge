const Sequelize = require('sequelize');

module.exports = class User_Team extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
          rank: Sequelize.STRING(10),
    }, {
      sequelize,
      // createdAt 
      timestamps: false,
      modelName: 'User_Team',
      tableName: 'user_team',
      paranoid: true,
    });
  }
};
