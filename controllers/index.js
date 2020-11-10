
/**
 * 
 * Index of all of the controllers in the service
 * 
 * @param {Sequelize} databaseConnection Sequelize Object containing the Database Connection
 * 
 */
module.exports = (databaseConnection) => {
    const celebSearchController = require('./CelebSearchController')(databaseConnection);
    const celebExploreController = require('./CelebExploreController')(databaseConnection);

    return {
        celebExploreController,
        celebSearchController
    };
}