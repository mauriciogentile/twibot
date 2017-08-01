"use strict";

const winston = require('winston');
const Mail = require('winston-mail').Mail;
const config = require("../config.js");

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: "debug",
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs.txt',
            level: 'info'
        })
    ]
});

/**
 * Configure mail transport
 */
logger.add(Mail, config.logger.options);

winston.addColors({
    error: "red"
});

module.exports = logger;