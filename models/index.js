module.exports =  (databaseConnection) => {
    const celebProfileModel = require('./CelebProfileModel')(databaseConnection);
    const celebStatsModel = require('./CelebStatsModel')(databaseConnection);

    celebStatsModel.belongsTo(celebProfileModel, { foreignKey: 'celeb_id' });
    celebProfileModel.hasOne(celebStatsModel, { foreignKey: 'celeb_id' });

    return {
        celebProfileModel,
        celebStatsModel
    };
};