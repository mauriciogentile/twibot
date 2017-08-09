"use strict";

const Twit = require("twit");
//const config = require("../config.js");
const logger = require("../util/logger.js");

class Twitter {

    constructor(secrets, search) {
        this.name = "Twitter";
        this.search = search;
        this.twit = new Twit({
            consumer_key: secrets.TWITTER_CONSUMER_KEY,
            consumer_secret: secrets.TWITTER_CONSUMER_SECRET,
            access_token: secrets.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: secrets.TWITTER_ACCESS_TOKEN_SECRET
        });
    }

    run() {
        let params = {
            q: this.search, result_type: "recent", lang: "en"
        };

        if (this.search == "@@home_timeline") {
            return this.getHomeTimeline();
        }

        return this.searchTweets(params);
    }

    searchTweets(params) {
        return this.twit.get("search/tweets", params).then(response => {
            if(response.data.statuses.errors) {
                logger.warn("Error searching Twitter", response.data.statuses.errors);
                return [];
            }
            return this.toResult(response.data.statuses);
        }).catch(err => logger.error(err));
    }

    getHomeTimeline() {
        return this.twit.get("statuses/home_timeline").then(response => {
            return this.toResult(response.data);
        });
    }

    toResult(statuses) {
        var results = [];
        statuses && statuses.forEach((status) => {
            results.push({ id: status.id_str, type: "tweet", text: status.text, points: status.retweet_count, source: this.name });
        });
        return results;
    }
}

module.exports = Twitter;