"use strict";

const util = require("util");
const request = require("request-promise");
const cheerio = require("cheerio");

class HtmlProvider {

    run() {
        var self = this;
        var results = [];
        var page = this.initialPage || 0;
        var pageStep = this.pagingStep || 1;
        const maxResults = this.maxResults || 100;

        var run = () => {
            return new Promise((resolve, reject) => {
                var options = {
                    uri: self.getFetchUrl(page),
                    transform: function (body) {
                        return cheerio.load(body);
                    }
                };
                request(options).then($ => {
                    self.parseResponse($, (error, results1) => {
                        results = results.concat(results1);
                        if (!results1.length || page < 0 || results.length >= maxResults) {
                            resolve(results);
                            return;
                        }
                        else {
                            page = page + pageStep;
                            run().then(resolve).catch(reject);
                        }
                    });
                }).catch((error, response) => {
                    if (response && response.statusCode > 299 && response.statusCode != 404) {
                        console.log(response.statusCode);
                        var err = new Error(util.format("Error fetching ads from '%s' url '%s'. Status is '%s' '%s'", options.name, options.uri, response.statusCode, response.statusMessage));
                        reject(err);
                        return;
                    }
                    if (error) {
                        var err = new Error(util.format("Error fetching ads from '%s' url '%s'.", self.name, options.uri));
                        console.log(error);
                        reject(err);
                        return;
                    }
                    if (response && response.statusCode == 404 && results.length) {
                        resolve(results);
                        return;
                    }
                });
            });
        };

        return run();
    }
}

module.exports = HtmlProvider;