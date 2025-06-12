module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    profile_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    bio: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    skills: {
      type: DataTypes.JSON, // safer cross-DB support than ARRAY
      defaultValue: [],
    },
    education: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    experience: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    github: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    linkedin: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Profiles',
    timestamps: false,
  });

  return Profile;
};
