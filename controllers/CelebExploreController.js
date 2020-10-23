'use strict'

const Models = require('../models');

module.exports = (pgConnection) => {

    const celebStatsModel = Models.default(pgConnection).CelebStatsModel;
    const celebProfilesModel = Models.default(pgConnection).CelebProfileModel;

    //This function sorts the celebs as per the keyToSortBy and returns numberOfCelebs from the top
    const sortFilterResult = function(celebs, keyToSortBy, numberOfCelebs) {
        const celebList = [];
        const result = [];

        for(let index in celebs)
            celebList.push(celebs[index]["dataValues"]);

        celebList.sort((a, b) => { return a[keyToSortBy] - b[keyToSortBy]; });

        for(let index = 0; index < numberOfCelebs && index < celebList.length; index++) 
            result.push(celebList[index]);

        return result;
    }

    const exploreCelebs = function () {
        return Promise.all([
            celebProfilesModel.findAll({
                attributes: ['celeb_id','celeb_joining_date','celeb_name','celeb_category']
            })
            .then((celebs) => { return sortFilterResult(celebs, "celeb_joining_date", 7); })
            .catch((err) => { 
                return new Error(`Error Fetching Trending Now Celebs!\n${err}`);
            }),
            
            celebStatsModel.findAll({
                attributes: ['celeb_id','celeb_likes'],
                include: [{
                    model: celebProfilesModel,
                    attributes: ['celeb_name', 'celeb_category']
                }]
            })
            .then((celebs) => { return sortFilterResult(celebs, "celeb_likes", 7); })
            .catch((err) => { 
                return new Error(`Error Fetching Trending Now Celebs!\n${err}`);
            })
        ]);
    };

    return {
        exploreCelebs
    };
};