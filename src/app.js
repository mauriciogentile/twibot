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

let run = () => {
    let pickAndTweet = (results, index) => {
        let entry = results[index];
        return post(entry)
            .then(() => {
                logger.info("Entry successfully twitted.", entry);
            })
            .catch(err => {
                logError(err, entry);
                // duplicated tweet or tweet too long, skip & retry
                if (err.code == 187 || err.code == 186 || err.code == 327) {
                    pickAndTweet(results, index + 1);
                }
            });
    };

    new TweetFeeder().run().then(results => {
        logger.info("Got " + results.length + " entries...");
        pickAndTweet(results, 0);
    }).catch(logError);
};

// run daemon as configured in rule
schedule.scheduleJob(config.scheduler.rule, run);

// run on start
run();