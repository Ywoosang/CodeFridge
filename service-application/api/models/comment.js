const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    }, {
      sequelize,
      // createdAt 
      timestamps: true,
      underscored: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.User,{
        foreignKey : 'ownerId',
        onDelete : 'CASCADE',
    });
    db.Comment.belongsTo(db.File,{
        foreignKey : 'fileId',
        onDelete : 'CASCADE',
    })
 }
};
