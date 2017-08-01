"use strict";

const Twitter = require("./twitter.js");
const Ycombinator = require("./ycombinator.js");
const Slashdot = require("./slashdot.js");

class CompositeFeeder {

    constructor(search) {
        this.name = "Composite";
    }

    run() {
        var promises = [];

        const providers = [new Twitter("#nodejs, #Nodejs"), new Ycombinator(), new Slashdot()];

        providers.forEach(provider => {
            promises.push(provider.run());
        });

        return Promise.all(promises)
            // merge
            .then(dataSet => {
                var results = [];
                dataSet.forEach(ds => results = results.concat(ds));
                return results;
            })
            // sort
            .then(data => data.sort((a, b) => b.points - a.points));
    }
}

module.exports = CompositeFeeder;