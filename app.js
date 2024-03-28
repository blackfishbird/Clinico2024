'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const config = require('./config');
const routes = require('./routes/index');
const logger = require('./lib/logger');

const app = express();

(async function () {
    try {
        logger(`Initializing`);

        mongoose.connection.on('connected', () => logger('connected'));
        mongoose.connection.on('disconnected', () => logger('disconnected'));
        mongoose.connection.on('close', () => logger('close'));
        mongoose.connect(config.MONGO_URL);

        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use('/', routes);

        app.listen(config.PORT, () => {
            logger(`Example app listening on port ${config.PORT}`);
        });
    } catch (err) {
        logger(err.message);
        mongoose.close();
        process.exit(1);
    }
})();