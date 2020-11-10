'use strict'

/**
 * 
 * Controller for handling clients requests for Celeb Explore Service.
 * 
 * @param {Sequelize} databaseConnection Sequelize Object containing the Database Connection
 * 
 */
module.exports = (databaseConnection) => {

    //Importing Modules
    const Models = require('../models');

    //Initializing Variables
    const celebStatsModel = Models(databaseConnection).celebStatsModel;
    const celebProfilesModel = Models(databaseConnection).celebProfileModel;

    /**
     * 
     * Function to return Trending Now celebs in the Bliss App
     * 
     * @param {String 8bits} clientCategory Categories/Topics client wants to meet celeb in
     * @param {float >= 0, <= 1} compatibilityCoefficient How much should be celebs categories be similar to the clients categories.
     * 1 means 100% similar, 0 means no similarity. Default value is 0.75, means top 25 similar celebs will be returned
     * 
     */
    const trendingNowCelebs = async (clientCategory, compatibilityCoefficient = 0.75) => {
        if(clientCategory === undefined) {
            return 'Client Category is Undefined';
        }
        if(clientCategory === null) {
            return 'Client Category is null';
        }

        const celebDataValues = await celebProfilesModel.findAll({ includes: [{ model: celebStatsModel }] });
        const celebs = [];
        const celebsCompatible = [];
        let clientPoints = 0;

        celebDataValues.forEach(celeb => celebs.push(celeb['dataValues']));

        if(celebs.length !== 0) {
            if(clientCategory.length !== celebs[0]['celeb_category'].length) {
                throw new Error('Client Categories and Celeb Categories are not similar length');
            }
        }

        for(let i = 0; i < clientCategory.length; i++) {
            if(clientCategory[i] === '1')
                clientPoints++;
        }

        if(clientPoints === 0) {
            return [[], 0, compatibilityCoefficient];
        }


        for(let i = 0; i < celebs.length; i++) {
            let rank = 0;
            const celebCategory = celebs[i]['celeb_category'];
            for(let category = 0; category < celebCategory.length; category++) {
                if(clientCategory[category] === celebCategory[category] && clientCategory[category] === '1'){
                    rank++;
                }
            }

            celebs[i]['rank'] = rank;
            celebs[i]['compatibility_percentage'] = ((rank * 100) / clientPoints);
        };

        if(compatibilityCoefficient > 1) {
            compatibilityCoefficient = 1;
        } else if(compatibilityCoefficient < 0) {
            compatibilityCoefficient = 0;
        }

        const rankingFactoy = (clientPoints * compatibilityCoefficient);

        celebs.forEach(celeb => {
            if(celeb['rank'] >= rankingFactoy)
                celebsCompatible.push(celeb);
        });

        celebsCompatible.sort((a, b) => {
            const aTrendingFactor = a['celeb_likes'] + 2 * (a['celeb_bliss_count']);
            const bTrendingFactor = b['celeb_likes'] + 2 * (b['celeb_bliss_count']);

            return (aTrendingFactor - bTrendingFactor);
        });

        return [celebsCompatible, clientPoints, compatibilityCoefficient];
    };

    /**
     * 
     * 
     * Function to return Celebs Recently Joined Bliss
     * 
     * @param {String 8bits} clientCategory Categories/Topics client wants to meet celeb in
     * @param {float >= 0, <= 1} compatibilityCoefficient How much should be celebs categories be similar to the clients categories.
     * 1 means 100% similar, 0 means no similarity. Default value is 0.75, means top 25 similar celebs will be returned
     */
    const recentlyJoinedCelebs = async (clientCategory, compatibilityCoefficient = 0.75) => {
        if(clientCategory === undefined) {
            throw new Error('Client Category is Undefined');
        }
        if(clientCategory === null) {
            throw new Error('Client Category is null');
        }

        const celebDataValues = await celebProfilesModel.findAll({ includes: [{ model: celebStatsModel }] });
        const celebs = [];
        const celebsCompatible = [];
        let clientPoints = 0;

        celebDataValues.forEach(celeb => celebs.push(celeb['dataValues']));

        if(celebs.length !== 0) {
            if(clientCategory.length !== celebs[0]['celeb_category'].length) {
                throw new Error('Client Categories and Celeb Categories are not similar length');
            }
        }

        for(let i = 0; i < clientCategory.length; i++) {
            if(clientCategory[i] === '1')
                clientPoints++;
        }

        if(clientPoints === 0) {
            return [[], 0, compatibilityCoefficient];
        }

        for(let i = 0; i < celebs.length; i++) {
            let rank = 0;
            const celebCategory = celebs[i]['celeb_category'];
            for(let category = 0; category < celebCategory.length; category++) {
                if(clientCategory[category] === celebCategory[category] && clientCategory[category] === '1'){
                    rank++;
                }
            }
            celebs[i]['rank'] = rank;
            celebs[i]['compatibility_percentage'] = ((rank * 100) / clientPoints);
        };

        if(compatibilityCoefficient > 1)
            compatibilityCoefficient = 1;
        
        else if(compatibilityCoefficient < 0)
            compatibilityCoefficient = 0;

        const rankingFactoy = (clientPoints * compatibilityCoefficient);

        celebs.forEach(celeb => {
            if(celeb['rank'] >= rankingFactoy)
                celebsCompatible.push(celeb);
        });

        celebsCompatible.reverse();

        return [celebsCompatible, clientPoints, compatibilityCoefficient];
    };

    return {
        recentlyJoinedCelebs, trendingNowCelebs
    };
};