"use strict";

const winston = require('winston');
const Mail = require('winston-mail').Mail;

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: "debug",
            colorize: true
        })
    ]
});

/**
 * Configure mail transport
 */
//logger.add(Mail, config.logger.options);

winston.addColors({
    error: "red"
});

module.exports = logger;