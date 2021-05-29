const Sequelize = require('sequelize');
const db = require('.')

module.exports = class Team extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
          name: {
            type: Sequelize.STRING(30),
            allowNull: false,
          },
    }, {
      sequelize,
      // createdAt 
      timestamps: true,
      underscored: false,
      modelName: 'Team',
      tableName: 'teams',
      paranoid: true,
    });
  }
  static associate(db) {
    db.Team.belongsToMany(db.User, { through: 'User_Team' });
    db.Team.hasMany(db.File,{
      foreignKey: 'teamId',
      onDelete: 'CASCADE' 
    }); 
    db.Team.hasMany(db.Folder,{
      foreignKey: 'teamId',
      onDelete: 'CASCADE' 
    }); 
  }
};
