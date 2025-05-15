'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RefreshToken.belongsTo(models.Usuario, {
        foreignKey: 'user_id',
        as: 'usuario'
      });
    }
  }
  RefreshToken.init({
    user_id: DataTypes.INTEGER,
    token: DataTypes.TEXT,
    expires_at: DataTypes.DATE,
    revoked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'RefreshToken',
  });
  return RefreshToken;
};