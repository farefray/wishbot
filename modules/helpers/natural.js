const natural = require('natural');
natural.PorterStemmerRu.attach();

const NaturalHelper = {};
NaturalHelper.extractStem = function (originalInput, noSencePart) {
    let stem = '';
    let distancedMessage = natural.LevenshteinDistance(originalInput, noSencePart, {search: true});
    if (distancedMessage.substring) {
        stem = originalInput.replace(distancedMessage.substring, "");
    }

    return natural.PorterStemmerRu.stem(stem.trim());
};

module.exports = NaturalHelper;