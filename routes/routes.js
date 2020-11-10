'use strict';

/**
 * 
 * Routes for the Celeb Explore Service
 * 
 * @param {Sequelize} databaseConnection Sequelize Object containing the Database Connection
 * 
 */
module.exports = (databaseConnection) => {

    //Importing Modules
    const express = require('express')
    const chalk = require('../chalk.console');
    const controller = require('../controllers');

    //Initializing Variables
    const router = express.Router();
    const celebExploreController = controller(databaseConnection).celebExploreController;
    const celebSearchController = controller(databaseConnection).celebSearchController;

    /**
     * 
     * 
     * Route for GET Recently Joined Celebs on Bliss App. Req query must have following two params:
     * 
     * client_categories:           String of 8 bits representing categories client has registered
     * compatibility_coefficient:   (Optional) Float, between -1 and 1, representing how similar clients 
     *                              categories must be celebs categories
     * 
     */
    router.get('/explore/recently-joined-celebs', async (req, res) => {
        const clientCategories = req.query.client_categories;
        const compatibilityCoefficient = req.query.compatibility_coefficient;

        try {
            const response = await celebExploreController.recentlyJoinedCelebs(clientCategories, compatibilityCoefficient)
            console.log(chalk.success(JSON.stringify(response)));
            res.send({
                Message: 'DONE',
                Response: 'Recently Joined Celebs List',
                Celebs: response,
                CompatibilityCoefficient: compatibilityCoefficient
            });
        }
        catch(err) {
            res.send({
                ERR: err.message
            });
            console.error(chalk.error(err));
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
    router.get('/explore/trending-celebs', async (req, res) => {
        const clientCategories = req.query.client_categories;
        const compatibilityCoefficient = req.query.compatibility_coefficient;
        
        try {
            const response = await celebExploreController.trendingNowCelebs(clientCategories, compatibilityCoefficient)
            console.log(chalk.success(JSON.stringify(response)));
            res.send({
                Message: 'DONE',
                Response: 'Trendind Celebs List',
                Celebs: response,
                CompatibilityCoefficient: compatibilityCoefficient
            });
        }
        catch(err) {
            res.send({
                ERR: err.message
            });
            console.error(chalk.error(`ERR: ${err}`));
        }
    });

    /**
     * 
     * Route for GET Celebs who have name similar to the req param provided celeb_name. Req query must
     * have the following param:
     * 
     * client_name:           Name of the Celeb, who is being searched by the client
     * 
     */
    router.get('/search/name', async (req, res) => {
        const celebName = req.query.celeb_name;
        try {
            const celebs = await celebSearchController.searchCelebsByName(celebName);
            const response = {
                Message: 'DONE',
                Response: `Celeb List by Name: ${celebName}`,
                Celebs: celebs
            };

            console.log(chalk.success(JSON.stringify(response)));
            res.send(response);
        }
        catch(err) {
            res.send({
                ERR: err.message
            });
            console.error(chalk.error(`ERR: ${err}`));
        }
    });

    /**
     * 
     * Route for GET Celebs who have category similar to the req param provided celeb_category. Req 
     * query must have the following param:
     * 
     * client_categories:           String of 8 bits representing categories of the celeb
     * 
     */
    router.get('/search/category', async (req, res) => {
        const celebCategory = req.query.celeb_category;

        try {
            const celebs = await celebSearchController.searchCelebsByCategory(celebCategory);
            const response = {
                Message: 'DONE',
                Response: `Celeb List by Category: ${celebName}`,
                Celebs: celebs
            };

            console.log(chalk.success(JSON.stringify(response)));
            res.send(response);
        }
        catch(err) {
            res.send({
                ERR: err.message
            });
            console.error(chalk.error(`ERR: ${err}`));
        }
    });
    
    return router;
};