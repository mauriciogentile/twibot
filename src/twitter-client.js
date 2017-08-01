"use strict";

const Twit = require("twit");
const config = require("./config.js");

class TwitterClient {

    constructor() {
        this.twit = new Twit(config.twitter);
    }

    retweet(tweetId, cb) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.twit.post("statuses/retweet/:id", {
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
        var self = this;
        return new Promise((resolve, reject) => {
            self.twit.post("statuses/update", tweet, (err, response) => {
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