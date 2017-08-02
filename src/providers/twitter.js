"use strict";

const Twit = require("twit");
const config = require("../config.js");

class Twitter {

    constructor(search) {
        this.name = "Twitter";
        this.search = search;
        this.twit = new Twit(config.twitter);
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
            return this.toResult(response.data.statuses);
        });
    }

    getHomeTimeline() {
        return this.twit.get("statuses/home_timeline").then(response => {
            return this.toResult(response.data);
        });
    }

    toResult(statuses) {
        var results = [];
        statuses.forEach((status) => {
            results.push({ id: status.id_str, type: "tweet", text: status.text, points: status.retweet_count, source: this.name });
        });
        return results;
    }
}

module.exports = Twitter;