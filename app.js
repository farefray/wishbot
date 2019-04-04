const natural = require('natural');

const allModules = require('./modules');

const appeals = ['желание', 'бот', 'bot'];

var App = /** @class */ (function () {
    "use strict";
    var instance = null;
    // Constructor
    function App() {
        if (instance) {
            return instance;
        }
        instance = this;
        this.modules = new Map();
    }

    App.getInstance = function () {
        return instance || new App();
    };

    App.prototype.getAppeal = function (text) {
        const lowText = text.toLowerCase();
        let appealResult = {
            is: false,
            appeal: ''
        };

        appeals.every(function(element) {
            if (lowText.indexOf(element) !== -1) {
                appealResult.is = true;
                appealResult.appeal = element;
                return false; // funny way for break in foreach
            }

            return true;
        });

        return appealResult;
    };

    const MIN_SCORE_FOR_MODULE = 0.65;

    App.prototype.ai = function (input) {
        var tokenizer = new natural.WordTokenizer();
        input = tokenizer.tokenize(input).join(' ').trim();

        let highestScore = 0;
        let highestModule = "";
        let highestPhrase = "";
        for (let value of this.modules.values()) {
            let languageModule = value();
            if (languageModule) {
                for (let phraseIndex in languageModule.phrases) {
                    let modulePhrase = languageModule.phrases[phraseIndex];
                    let distance = natural.JaroWinklerDistance(modulePhrase, input);
                    if (distance > MIN_SCORE_FOR_MODULE && distance > highestScore) {
                        highestScore = distance;
                        highestModule = languageModule.moduleName;
                        highestPhrase = modulePhrase;
                    }
                }
            }
        }

        let response = {
            moduleName: null,
            likeness: 0,
            highestPhrase: '',
            usersInput: input
        };

        try {
            console.log('Highest score: ' + highestScore);
            console.log('ModuleName: ' + moduleName);
            console.log('HighestPhrase: ' + highestPhrase);
            console.log('Users input: ' + input)
            if (highestScore >= 0.7) {
                response.moduleName = highestModule;
                response.likeness = Math.round(highestScore * 1000) / 1000;
                response.highestPhrase = highestPhrase;
            }

            return response;
        }
        catch (ex) {
            return response;
        }
    };

    App.prototype.process = function (moduleConf, ctx) {
        console.log('Processing module - ' + moduleConf.moduleName);
        if (allModules.textModules[moduleConf.moduleName]) {
            let requiredModule = allModules.textModules[moduleConf.moduleName]();
            // this one seems like horrible wrong. requiredModule contains all the modules itself....
            return requiredModule.run(ctx, moduleConf);
        }
        return Promise.reject();
    };

    return App;
}());

module.exports = App;