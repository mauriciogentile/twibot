"use strict";

const HtmlProvider = require("./html-provider.js");
const sourceUrl = "https://slashdot.org/";

class Slashdot extends HtmlProvider {

    constructor() {
        super();
        this.name = "Slashdot";
        this.initialPage = 0;
        this.maxResults = 20;
    }

    getFetchUrl() {
        return sourceUrl;
    }

    parseResponse($, cb) {
        var self = this;
        var $items = $("h2.story");

        if (!$items.length) {
            cb(null, []);
            return;
        }

        var results = [];

        $items.each((index, el) => {
            var $el = $(el);
            results.push(parse(index, $el));
        });

        function parse(index, $el) {
            var comments = $el.find(".comment-bubble").first().text();
            var title = $el.find("span.story-title").first().text();
            var url = "https:" + $el.find("span.story-title").find("a").first().attr("href");
            var points = Number.parseInt(comments);
            points = isNaN(points) ? 0 : points;
            var item = { url: url, text: title, type: "link", points: points, source: self.name };
            return item;
        }

        cb(null, results);
    }
}

module.exports = Slashdot;