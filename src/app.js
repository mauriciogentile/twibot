"use strict";

const config = require("./config.js");
const TweetFeeder = require("./providers/composite-feeder.js");
const TwitterClient = require("./twitter-client");
const schedule = require("node-schedule");
const logger = require("./util/logger.js");

const errorHandler = (err, response) => {
    if (err) {
        logger.error("Error tweeting: " + err.message);
    }
};

const post = (entry) => {
    const client = new TwitterClient();
    const type = entry.type;
    switch (type) {
        case 'link':
            return client.postUpdate({ status: entry.text + " " + entry.url });
        case 'tweet':
            return client.retweet(entry.id);
        default:
            throw new Error("Invalid entry");
    }
};

var j = schedule.scheduleJob(config.scheduler.rule, function () {

    new TweetFeeder().run()
        // pick first two
        .then(results => {
            logger.info(results.length);
            return results[0];
        })
        // post
        .then(entry => {
            try {
                post(entry).catch(errorHandler);
            }
            catch (err) {
            }
        })
        .catch(console.log);
});