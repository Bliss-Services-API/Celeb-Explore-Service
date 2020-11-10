'use strict'

/**
 * 
 * Controller for handling clients requests for Celeb Search Service
 * 
 * @param {Sequelize} databaseConnection Sequelize Object containing the Database Connection
 * 
 */
module.exports = (databaseConnection) => {

    //Importing Modules
    const Models = require('../models');

    //Initializing Variables
    const celebProfilesModel = Models(databaseConnection).celebProfileModel;
    const celebStatsModel = Models(databaseConnection).celebStatsModel;

    /**
     * 
     * Function to fetch the list of celebs in a category
     * 
     * @param {string} celebCategory 8 bits String, representing category of celebs to be searched in
     * @return {array} Array of celebs
     * 
     */
    const searchCelebsByCategory = async celebCategory => {
        return await celebProfilesModel.findAll({
            where: { 'celeb_category': celebCategory },
            includes: [
                {
                    model: celebStatsModel
                }
            ]
        })
    };

    /**
     * 
     * Function to fetch the list of celebs with a name
     * 
     * @param {string} celebName String, representing the name of celebs to search for
     * @return {array} Array of celebs
     * 
     */
    const searchCelebsByName = async celebName => {
        return await celebProfilesModel.findAll({
            where: { 'celeb_name': celebName },
            includes: [
                {
                    model: celebStatsModel
                }
            ]
        })
    };

    return {
        searchCelebsByCategory,
        searchCelebsByName
    };
};