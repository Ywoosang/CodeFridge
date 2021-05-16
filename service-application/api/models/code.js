const Sequelize = require('sequelize');

module.exports = class Code extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      num : {
        type: Sequelize.INTEGER.UNSIGNED,
        unique:true,
        primaryKey:true,
      },
    }, {
      sequelize,
      // createdAt 
      timestamps: false,
      underscored: false,
      modelName: 'Code',
      tableName: 'codes',
    });
  }
  static associate(db) {
    db.Code.hasMany(db.Folder,{
        foreignKey : 'codeNumber'
    });
 }
};
