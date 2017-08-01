"use strict";

const winston = require('winston');
const Mail = require('winston-mail').Mail;
const config = require("../config.js");

const customLevels = {
    levels: {
        debug: 1,
        info: 3,
        error: 5,
        errorNotification: 6
    }
};

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: "debug",
            colorize: true
        })
    ],
    levels: customLevels.levels
});

/**
 * Configure mail transport
 */
logger.add(Mail, config.logger.email);

winston.addColors({
    errorNotification: "red"
});

module.exports = logger;