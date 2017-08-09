"use strict";

const TweetFeeder = require("./providers/composite-feeder.js");
const TwitterClient = require("./twitter-client");
const schedule = require("node-schedule");
const logger = require("./util/logger.js");

const post = (secrets, entry) => {
    let client = new TwitterClient(secrets);
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

module.exports = (ctx, cb) => {
    
    let pickAndTweet = (results, index) => {
        let entry = results[index];
        return post(ctx.secrets, entry)
            .then(() => {
                logger.info("Entry successfully twitted.", entry);
                cb(null, entry);
            })
            .catch(err => {
                logger.error("Error tweeting: " + err.message, [entry]);
                // duplicated tweet or tweet too long, skip & retry
                if (err.code == 187 || err.code == 186 || err.code == 327) {
                    pickAndTweet(results, index + 1);
                }
            });
    };

    new TweetFeeder(ctx.secrets)
        .run()
        .then(results => {
            logger.info("Got " + results.length + " entries...");
            if(results.length) {
                logger.info("Processing...");
                pickAndTweet(results, 0);
            }
            else {
                var msg = "No entries found!";
                logger.warn(msg);
                cb(null, msg);
            }
        })
        .catch(err => logger.error(err));
};