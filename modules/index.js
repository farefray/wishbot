
require('./string');

const glob = require('glob'),
    path = require('path');

let commandModules = [],
    textModules = {};

glob.sync('./modules/commands/*.js').forEach(function (file) {
    commandModules.push(require(path.resolve(file)));
});

glob.sync('./modules/text/*.js').forEach(function (file) {
    let moduleName = (file.replace(/^.*[\\\/]/, '')).replace('.js', '');
    textModules[moduleName] = require(path.resolve(file));
});

var modules = {
    commandModules: commandModules,
    textModules: textModules
};

module.exports = modules;
