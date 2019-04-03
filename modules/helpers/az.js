const Az = require('az');
Az.Morph.init(() => {});

const AzHelper = {};
// TODO!
AzHelper.normalize = (str) => {
    let test = Az.Morph(str);
    console.log(test[0].normalize());
    return str;
};

module.exports = AzHelper;
