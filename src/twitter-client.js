"use strict";

const twit = require("twit");
const config = require("./config.js");
const Twitter = new twit(config);

class TwitterClient {

    constructor() {
    }

    retweet(tweetId, cb) {
        return new Promise((resolve, reject) => {
            Twitter.post("statuses/retweet/:id", {
                id: tweetId
            }, (err, response) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(response);
            });
        });
    }
    postUpdate(tweet, cb) {
        return new Promise((resolve, reject) => {
            Twitter.post("statuses/update", tweet, (err, response) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(response);
            });
        });
    }
};

module.exports = TwitterClient;