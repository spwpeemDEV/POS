const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('db_peempos','postgres','peemrock10',{
    host: 'localhost',
    dialect: 'postgres',
    logging:false
});

module.exports = sequelize;