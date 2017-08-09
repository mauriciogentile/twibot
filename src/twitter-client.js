"use strict";

const Twit = require("twit");
//const config = require("./config.js");

class TwitterClient {

    constructor(secrets) {
        this.twit = new Twit({
            consumer_key: secrets.TWITTER_CONSUMER_KEY,
            consumer_secret: secrets.TWITTER_CONSUMER_SECRET,
            access_token: secrets.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: secrets.TWITTER_ACCESS_TOKEN_SECRET
        });
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