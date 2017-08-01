"use strict";

const TweetFeeder = require("./providers/composite-feeder.js");
const TwitterClient = require("./twitter-client");
const schedule = require("node-schedule");

const errorHandler = (err, response) => {
    if (err) {
        console.log("Error tweeting: " + err.message);
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

var j = schedule.scheduleJob("0 * * * * *", function () {
    console.log("Running...");

    new TweetFeeder().run()
        // pick first two
        .then(results => {
            console.log(results.length);
            return results.slice(0, 2);
        })
        // post
        .then(entries => {
            entries.forEach(entry => {
                try {
                    post(entry).catch(errorHandler);
                }
                catch (err) {
                }
            });
        })
        .catch(console.log);
});