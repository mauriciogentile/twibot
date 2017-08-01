"use strict";

const validUrl = require("valid-url");
const HtmlProvider = require("./html-provider.js");
const sourceUrl = "https://news.ycombinator.com";

class Ycombinator extends HtmlProvider {

    constructor() {
        super();
        this.name = "Ycombinator";
        this.initialPage = 0;
        this.maxResults = 10;
    }

    getFetchUrl() {
        return sourceUrl;
    }

    parseResponse($, cb) {
        var self = this;
        var $items = $("table.itemlist").find("tr.athing");
        var $itemInfo = $("table.itemlist").find("td.subtext");

        if (!$items.length || $items.length !== $itemInfo.length) {
            cb(null, []);
            return;
        }

        var results = [];

        $items.each((index, el) => {
            var $el = $(el);
            if ($el.hasClass("athing")) {
                var entry = tryParse(index, $el);
                if (entry)
                    results.push(entry);
            }
        });

        function tryParse(index, $el) {
            var url = $el.find("td.title a").first().attr("href");
            if (!validUrl.isUri(url)) {
                return null;
            }
            var title = $el.find("td.title a").first().text();
            var data = $($itemInfo[index]).text();
            var commentsStr = data.substr(data.lastIndexOf("|") + 1);
            var comments = Number.parseInt(commentsStr);
            comments = isNaN(comments) ? 0 : comments;
            return { url: url, text: title, type: "link", points: comments, source: self.name };
        }

        cb(null, results);
    }
}

module.exports = Ycombinator;