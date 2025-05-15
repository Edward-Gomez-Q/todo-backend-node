'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tarea extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tarea.belongsTo(models.Usuario, {
        foreignKey: 'usuarios_id',
        as: 'usuario'
      });
      Tarea.belongsTo(models.Estado, {
        foreignKey: 'estado_id',
        as: 'estado'
      });
    }
  }
  Tarea.init({
    usuarios_id: DataTypes.INTEGER,
    estado_id: DataTypes.INTEGER,
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    fechaLimite: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Tarea',
  });
  return Tarea;
};