const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const db = {};

const sequelize = require('../config/sequilize');
const Sequelize = require('sequelize');

fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.endsWith('.js'))
  .forEach(file => {
    const modelDef = require(path.join(__dirname, file));
    const model = modelDef(sequelize, Sequelize.DataTypes); // ✅ pass sequelize + DataTypes
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // pass db so it can use db.Profile, db.Student, etc.
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
