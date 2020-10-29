'use strict';

/**
 * 
 * Routes for the Celeb Explore Service
 * 
 * @param {Sequelize} databaseConnection Sequelize Object containing the Database Connection
 */
module.exports = (databaseConnection) => {    
    const router = require('express').Router();
    const chalk = require('../chalk.console');
    const CelebExploreController = require('../controllers/CelebExploreController')(databaseConnection);

    /**
     * 
     * Route for GET Recently Joined Celebs on Bliss App. Req query must have following two params:
     * 
     * client_categories:           String of 8 bits representing categories client has registered
     * compatibility_coefficient:   (Optional) Float, between -1 and 1, representing how similar clients 
     *                              categories must be celebs categories
     * 
     */
    router.get('/recently-joined-celebs', async (req, res) => {
        const clientCategories = req.query.client_categories;
        const compatibilityCoefficient = req.query.compatibility_coefficient;

        try {
            const response = await CelebExploreController.recentlyJoinedCelebs(clientCategories, compatibilityCoefficient);
            console.log(chalk.success(JSON.stringify(response)));
            res.send(response);
        }
        catch(err) {
            console.error('Error:\n' + chalk.error(JSON.stringify(err)));
            res.send({
                ERR: err
            });
        }
    });

    /**
     * 
     * Route for GET Trending Celebs on Bliss App. Req query must have following two params:
     * 
     * client_categories:           String of 8 bits representing categories client has registered
     * compatibility_coefficient:   (Optional) Float, between -1 and 1, representing how similar clients 
     *                              categories must be celebs categories
     * 
     */
    router.get('/trending-celebs', async (req, res) => {
        const clientCategories = req.query.clientCategories;
        const compatibilityCoefficient = req.query.compatibilityCoefficient;

        try {
            const response = await CelebExploreController.trendingNowCelebs(clientCategories, compatibilityCoefficient);
            console.log(chalk.success(JSON.stringify(response)));
            res.send(response);
        }
        catch(err) {
            console.error('Error:\n' + chalk.error(JSON.stringify(err)));
            res.send({
                ERR: err
            });
        }
    });
    
    return router;
};