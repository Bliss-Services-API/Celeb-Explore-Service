'use strict';

/**
 * 
 * Database Connection for the registered celebs in the Bliss App
 * 
 * @param {String} mode Environment of Server Running. Values can be either 'development' or 'production'
 * 
 */
module.exports = (mode) => {

    //Import Modules
    const Sequelize = require('sequelize');
    const databaseConfig = require('../config/config.json');

    if(mode === 'development') {
        /**
         * 
         * Return Development Database Config Connection
         * 
         */
        return new Sequelize(databaseConfig.development.database, databaseConfig.development.username, databaseConfig.development.password, {
            host: databaseConfig.development.host,
            port: databaseConfig.development.port,
            dialect: databaseConfig.development.dialect,
            logging: console.log,
            pool: {
                max: 5,
                min: 0,
                idle: 1000
            },
        })
    } else {
        /**
         * 
         * Return Production Database Config Connection
         * 
         */
        return new Sequelize(databaseConfig.production.database, databaseConfig.production.username, databaseConfig.production.password, {
            host: databaseConfig.production.host,
            port: databaseConfig.production.port,
            dialect: databaseConfig.production.dialect,
            logging: console.log,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            pool: {
                max: 5,
                min: 0,
                idle: 1000
            },
        })
    }
}