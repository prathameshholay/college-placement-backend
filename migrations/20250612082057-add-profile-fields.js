'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Profiles', 'skills', {
      type: Sequelize.TEXT, // Use JSON if supported
      defaultValue: '[]',
    });
    await queryInterface.addColumn('Profiles', 'education', {
      type: Sequelize.TEXT,
      defaultValue: '',
    });
    await queryInterface.addColumn('Profiles', 'experience', {
      type: Sequelize.TEXT,
      defaultValue: '',
    });
    await queryInterface.addColumn('Profiles', 'github', {
      type: Sequelize.STRING,
      defaultValue: '',
    });
    await queryInterface.addColumn('Profiles', 'linkedin', {
      type: Sequelize.STRING,
      defaultValue: '',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Profiles', 'skills');
    await queryInterface.removeColumn('Profiles', 'education');
    await queryInterface.removeColumn('Profiles', 'experience');
    await queryInterface.removeColumn('Profiles', 'github');
    await queryInterface.removeColumn('Profiles', 'linkedin');
  }
};
