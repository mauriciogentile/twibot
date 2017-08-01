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
        var self = this;

        var params = {
            q: self.search, result_type: "recent", lang: "en"
        };

        return self.twit.get("search/tweets", params).then(tweets => {
            var results = [];
            tweets.data.statuses.forEach((status) => {
                results.push({ id: status.id_str, type: "tweet", text: status.text, points: status.retweet_count, source: self.name });
            });
            return results;
        });
    }
}

module.exports = Twitter;