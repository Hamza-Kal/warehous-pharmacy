'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.bulkDelete('user', null, {});
    await queryInterface.bulkInsert('user', [
      {
        email: 'admin@admin.com',
        password:
          '$2b$10$SShBuFns2R7qtQhxfDGk.Ol.rvQjsWGWahLtSj0SGbtQ2SgskjNJa',
        fullName: 'adminName',
        role: 'admin',
        completedAccount: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  },
};
