const natural = require('natural');

const allModules = require('./modules');

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

    App.prototype.isAppeal = function (text) {
        const lowText = text.toLowerCase();
        return (lowText.indexOf('желание') !== -1 || lowText.indexOf('bot') !== -1 || lowText.indexOf('бот') !== -1);
    };

    App.prototype.ai = function (input) {
        let highestScore = 0;
        let highestModule = "";
        for (let value of this.modules.values()) {
            let languageModule = value();
            if (languageModule) {
                for (let phraseIndex in languageModule.phrases) {
                    let element = languageModule.phrases[phraseIndex];
                    let distance = natural.JaroWinklerDistance(element, input);
                    if (distance > highestScore) {
                        highestScore = distance;
                        highestModule = languageModule.moduleName;
                    }
                }
            }
        }

        let response = {
            moduleName: null,
            likeness: 0
        };

        try {
            console.log('Highest score: ' + highestScore);
            console.log('ModuleName: ' + moduleName);
            if (highestScore >= 0.7) {
                response.moduleName = highestModule;
                response.likeness = Math.round(highestScore * 1000) / 1000;
            }

            return response;
        }
        catch (ex) {
            return response;
        }
    };

    App.prototype.process = function (moduleName, ctx) {
        console.log('Processing module - ' + moduleName);
        if (allModules.textModules[moduleName]) {
            let requiredModule = allModules.textModules[moduleName]();
            // this one seems like horrible wrong. requiredModule contains all the modules itself....
            return requiredModule.run(ctx);
        }
        return Promise.reject();
    };

    return App;
}());

module.exports = App;