'use strict';


/**
 * 
 * **Server Entrypoint**. 
 * 
 * This server handles the Explore Celebs Service, which offers celebs who
 * are recently registered, trending now, and online now. All of the celebrities will have similar
 * categories as the client's. How much similar will they be, must to be specified in compatibilty 
 * coefficient while HTTP requesting from the server. Value of 1 will be exactly similar, and value
 * of -1 will be exactly opposite.
 * 
 * All of the routes are accessed only by the authorized users. Authorization includes:
 * JWT Token:       For clients
 * API Key:         For Admins
 * 
 */

require('dotenv').config();

let databaseConnection;
const bodyParser = require('body-parser');
const express = require('express');
const celebExploreRoutes = require('./routes/routes');
const chalk = require('./chalk.console');
// const morgan = require('morgan');

const PORT = process.env.PORT || 8001;
const env = process.env.NODE_ENV;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(morgan('dev'));

if(env === 'development') {
    databaseConnection = require('./connections/PGConnection')('development');
    console.log(chalk.info('###### SERVER RUNNING IN DEVELOPMENT MODE ######'));
}
else if(env === 'production') {
    databaseConnection = require('./connections/PGConnection')('production');
    console.log(chalk.info('###### SERVER RUNNING IN PRODUCTION MODE ######'));
}
else {
    console.error('Error:\n' + chalk.error('No Environment Provided'));
    process.exit(1);
}

databaseConnection.authenticate()
    .then(() => console.info(chalk.success(`Database Connection Established Successfully!`)))
    .then(() => app.use('/clients/explore', celebExploreRoutes(databaseConnection)))
    .then(() => console.info(chalk.success(`Routes Established Successfully!`)))
    .catch((err) => console.error('Error:\n' + chalk.error(`Database Connection Connection Failed! ${err}`)));

app.listen(PORT, () => console.info(chalk.success(`Explore-Celeb-Service is running on port ${PORT}`)));