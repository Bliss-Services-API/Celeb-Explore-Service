'use strict';

const Sequelize = require('sequelize');

module.exports = (pgConnection) => {
    const CelebProfileModel = pgConnection.define('celeb_profile', {
        celeb_id:           { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
        celeb_name:         { type: Sequelize.TEXT, allowNull: false, unique: 'celebUniqueId' },
        celeb_joining_date: { type: Sequelize.BIGINT, allowNull: false },
        celeb_category:     { type: Sequelize.TEXT, allowNull: false, unique: 'celebUniqueId' },
        celeb_position_id:  { type: Sequelize.BIGINT, allowNull: false, unique: 'celebUniqueId' },
        celeb_introduction: { type: Sequelize.TEXT, allowNull: false, unique: true },
    }, {
        timestamps: false
    });
    return CelebProfileModel;
};