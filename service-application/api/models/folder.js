const Sequelize = require('sequelize');
const db = require('../models')

module.exports = class Folder extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
          name: {
            type: Sequelize.STRING(50),
            allowNull: false,
          },
          favorate : {
            type : Sequelize.TINYINT(1),
            defaultValue : 0,
            allowNull : false
          }
    }, {
      sequelize,
      // createdAt 
      timestamps: true,
      underscored: false,
      modelName: 'Folder',
      tableName: 'folders',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
       db.Folder.belongsTo(db.Folder,{
           foreignKey : 'parentId',
       });
       db.Folder.hasMany(db.Folder,{
            foreignKey : 'parentId',
       });
       db.Folder.hasMany(db.File,{
           foreignKey: 'folderId'
       });
       db.Folder.belongsTo(db.User,{
           foreignKey : 'ownerId'
       }); 
 }
};
