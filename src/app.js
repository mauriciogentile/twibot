"use strict";

const config = require("./config.js");
const TweetFeeder = require("./providers/composite-feeder.js");
const TwitterClient = require("./twitter-client");
const schedule = require("node-schedule");
const logger = require("./util/logger.js");

const logError = (err, entry) => {
    if (err) {
        logger.error("Error tweeting: " + err.message, [entry]);
    }
};

const post = (entry) => {
    let client = new TwitterClient();
    let type = entry.type;
    switch (type) {
        case 'link':
            return client.postUpdate({ status: entry.text + " " + entry.url });
        case 'tweet':
            return client.retweet(entry.id);
        default:
            throw new Error("Invalid entry");
    }
};

// repeate tho inner rutine as configure in rule
schedule.scheduleJob(config.scheduler.rule, () => {

    let pickAndTweet = (results, index) => {
        let entry = results[index];
        return post(entry).catch(err => {
            logError(err, entry);
            // duplicated tweet, skip & retry
            if (err.code == 187) {
                pickAndTweet(results, index + 1);
            }
        });
    };

    new TweetFeeder().run().then(results => {
        logger.info("Got " + results.length + " entries...");
        var pick = 0;
        pickAndTweet(results, 0);
    }).catch(logError);
});