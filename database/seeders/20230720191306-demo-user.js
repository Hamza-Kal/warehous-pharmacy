'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
    await queryInterface.bulkInsert('user', [
      {
        email: 'admin@admin.com',
        username: 'adminAccount',
        password: '12345678',
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
