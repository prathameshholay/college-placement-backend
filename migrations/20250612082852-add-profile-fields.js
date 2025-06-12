module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Profiles', 'skills', {
      type: Sequelize.TEXT, // Use JSON if your DB supports it
      defaultValue: '[]',
    });
    await queryInterface.addColumn('Profiles', 'education', {
      type: Sequelize.TEXT,
      defaultValue: '',
    });
    // repeat for experience, github, linkedin, etc.
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Profiles', 'skills');
    await queryInterface.removeColumn('Profiles', 'education');
    // etc.
  },
};
