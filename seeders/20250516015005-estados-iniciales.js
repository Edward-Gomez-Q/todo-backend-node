'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Estados', [
      { estado: 'Pendiente', createdAt: new Date(), updatedAt: new Date() },
      { estado: 'En progreso', createdAt: new Date(), updatedAt: new Date() },
      { estado: 'Completada', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Estados', null, {});
  }
};
