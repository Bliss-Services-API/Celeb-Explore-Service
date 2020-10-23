'use strict';

const router = require('express').Router();
const CelebExploreController = require('../controllers/CelebExploreController');

module.exports = (pgConnection) => {
    router.get('/celeb-explore', async (req, res) => {
        const exploreCelebrity = await CelebExploreController(pgConnection).exploreCelebs();

        res.status(200).send({
            "explore-service-response": {
                "recently-joined": exploreCelebrity[0],
                "trending-now": exploreCelebrity[1]
            }
        });
    });
    return router;
};