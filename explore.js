'use strict';

require('dotenv').config();

const CelebDBConnection = require('./connections/CelebDBConnection');
const bodyParser = require('body-parser');
const express = require('express');
const ExploreCelebsRoutesAPI = require('./routes/ExploreCelebsServiceRoutes');
const morgan = require('morgan');

const PORT = process.env.PORT || 8001;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));


CelebDBConnection
    .authenticate()
    .then(() => console.info(`Celebs DB Connection Established Successfully!`))
    .then(() => app.use('/clients', ExploreCelebsRoutesAPI(CelebDBConnection)))
    .then(() => console.info(`Routes Established Successfully!`))
    .catch((err) => console.error(`Celebs DB Connection Connection Failed! ${err}`))


app.listen(PORT, () => {
    console.log(chalk.info(`Explore-Celeb-Service is running on port ${PORT}`));
})