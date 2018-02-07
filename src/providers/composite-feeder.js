"use strict";

const path = require("path");
const logger = require("../util/logger.js");
const Twitter = require("./twitter.js");
const Slashdot = require("./slashdot.js");
const Ycombinator = require("./ycombinator.js");

var _secrets = null;

class CompositeFeeder {

    constructor(secrets) {
        this.name = "Composite";
        _secrets = secrets;
    }

    run() {

        logger.info("Running " + this.name);
        logger.info("Loading providers...");

        let providers = this.loadProviders(_secrets);

        logger.info(providers.length + " loaded providers");

        let promises = [];

        providers.forEach(provider => {
            logger.info("Running " + provider.name);
            promises.push(provider.run());
        });

        return Promise.all(promises)
            // merge & flatten data
            .then(dataSet => {
                var results = [];
                dataSet.forEach(ds => results = results.concat(ds));
                return results;
            })
            // sort
            .then(data => data.sort((a, b) => b.points - a.points));
    }

    loadProviders(secrets) {
        
        let providers = [
            new Twitter(secrets, "#nodejs, #NodeJs, #JavaScript"),
            new Slashdot(),
            new Ycombinator()
        ];
        
        return providers;
    };
}

module.exports = CompositeFeeder;