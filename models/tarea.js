'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tarea extends Model {
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
    hooks: {
      async beforeCreate(tarea, options) {
        if(!tarea.estado_id) {
          const { Estado } = sequelize.models;
          const estadoPendiente = await Estado.findOne({ where: { estado: 'Pendiente' } });
          if (estadoPendiente) {
            tarea.estado_id = estadoPendiente.id;
          }
        }
      }
    }
  });
  return Tarea;
};