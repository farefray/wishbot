
const glob = require('glob'),
    path = require('path');

let commandModules = []
    textModules = [];

glob.sync('./modules/commands/*.js').forEach(function (file) {
    commandModules.push(require(path.resolve(file)));
});

glob.sync('./modules/text/*.js').forEach(function (file) {
    textModules.push(require(path.resolve(file)));
});

module.exports = {
    commandModules,
    textModules
};
