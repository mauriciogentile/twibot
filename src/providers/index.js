'use strict';

const path = require("path");
var providers = [];

require("fs").readdirSync(__dirname).forEach(function (file) {
    if (file.endsWith(".js") && file != "index.js" && file != "html-provider.js") {
        var Provider = require("./" + file);
        providers.push(new Provider());
    }
});

module.exports = providers;