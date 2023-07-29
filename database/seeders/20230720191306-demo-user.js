'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const user = await queryInterface.bulkDelete(
      'user',
      {
        email: 'admin@admin.com',
      },
      {},
    );
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
    const toBeCreatedCategories = [
      {
        category: 'مضادات الحموضة',
      },
      {
        category: 'مسكنات الألم',
      },
      {
        category: 'منظمات الدورة الدموية',
      },
      {
        category: 'مضادات حيوية',
      },
      {
        category: 'مضادات جراثيم',
      },
      {
        category: 'مضادات الفيروسات',
      },
      {
        category: 'مخفضات حرارة',
      },
      {
        category: 'مكملات غذائية',
      },
    ];
    await queryInterface.bulkInsert('category', toBeCreatedCategories);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  },
};
