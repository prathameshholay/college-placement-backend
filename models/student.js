module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    student_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resume_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'Students',
    timestamps: false,
  });

  Student.associate = (models) => {
    Student.hasOne(models.Profile, {
      foreignKey: 'email',
      sourceKey: 'email',
      as: 'profile',
    });
  };

  return Student;
};
