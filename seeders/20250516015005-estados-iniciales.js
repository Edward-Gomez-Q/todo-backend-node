'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Estados', [
      { estado: 'pendiente', createdAt: new Date(), updatedAt: new Date() },
      { estado: 'en progreso', createdAt: new Date(), updatedAt: new Date() },
      { estado: 'completada', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Estados', null, {});
  }
};
