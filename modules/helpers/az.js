const Az = require('az');
Az.Morph.init(() => {});

const AzHelper = {};
AzHelper.getNormalized = (str) => {
    let morphed = Az.Morph(str);
    let normalized = morphed[0].normalize();
    return normalized.word || str;
};

module.exports = AzHelper;
