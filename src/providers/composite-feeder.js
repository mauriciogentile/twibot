"use strict";

const path = require("path");
const providersConfig = require("../config.js").providers;

class CompositeFeeder {

    constructor(search) {
        this.name = "Composite";
    }

    run() {

        let providers = this.loadProviders();
        let promises = [];

        providers.forEach(provider => {
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

    loadProviders() {
        let providers = [];
        let files = require("fs").readdirSync(__dirname);
        providersConfig.forEach(p => {
            files.forEach((file) => {
                if (file.endsWith(".js") && file == p.name) {
                    let provider = require("./" + file);
                    providers.push(new provider(p.arguments));
                }
            })
        });
        return providers;
    };
}

module.exports = CompositeFeeder;