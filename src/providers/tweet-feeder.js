"use latest";

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

        providers.map(provider => {
            promises.push(provider.run());
        });

        return Promise.all(promises);
    }
}

module.exports = CompositeFeeder;