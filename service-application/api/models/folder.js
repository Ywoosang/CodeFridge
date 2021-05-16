const Sequelize = require('sequelize');
const db = require('../models')

module.exports = class Folder extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
          name: {
            type: Sequelize.STRING(300),
            allowNull: false,
          },
          hierarchy : {
            type : Sequelize.INTEGER(20),
          }
    }, {
      sequelize,
      // createdAt 
      timestamps: true,
      underscored: false,
      modelName: 'Folder',
      tableName: 'folders',
      paranoid: true,
    });
  }

  static associate(db) {
       db.Folder.belongsTo(db.User,{
           foreignKey : 'ownerId'
       }); 
       db.Folder.belongsTo(db.Code,{
           foreignKey : 'codeNumber'
       });
       db.Folder.hasMany(db.File,{
        foreignKey: 'folderId'
    });
 }
};
