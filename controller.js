const helpers = require('./helpers');
const config = require('./modules/old');
const allModules = require('./modules');

const selfName = "желание";
const Controller = () => ({
    command(ctx) {
        let activeModule = null;
        allModules.commandModules.every(function(element, index) {
            if (element.active(ctx)) {
                activeModule = element;
                return false; // funny way for break in foreach
            }

            return true;
        });

        if (activeModule) {
            return Promise.resolve(activeModule.process(ctx));
        }
        
        return Promise.resolve();
    },
    middleware(ctx) {
        let activeModule = null;
        allModules.textModules.every(function(element, index) {
            if (element.active(ctx)) {
                activeModule = element;
                return false; // funny way for break in foreach
            }

            return true;
        });

        if (activeModule) {
            return Promise.resolve(activeModule.process(ctx));
        }
        
        return Promise.resolve();
    }
});

module.exports = Controller();

/*
let { text: messageText } = ctx.message;

        let isAppeal = (messageText.toLowerCase().indexOf(selfName.toLowerCase()) !== 0);

        let actioned = false;
        let resultResponse = "";
        config.logic.reverse().forEach(function (item, i) {
            if ((item.canIgnoreName || isAppeal) && !actioned) {
                if (messageText.toLowerCase().indexOf(item.word.toLowerCase()) !== -1) {
                    actioned = true;
                    if (helpers.isFunction(item.action)) {
                        let result = item.action(messageText);
                        if (result && result.length) {
                            resultResponse = result;
                        }
                    } else {
                        resultResponse = item.action;
                    }

                    return true;
                }
            }
        });

        if (isAppeal) {
            if (!actioned) {
                if (messageText.endsWith('?')) {
                    var rand_no = helpers.getRandomInt(1, 3);
                    switch (rand_no) {
                        case 1: {
                            resultResponse = "Да";
                            break;
                        }
                        case 2: {
                            resultResponse = "Нет";
                            break;
                        }
                        case 3: {
                            resultResponse = "Не знаю";
                            break;
                        }
                    }
                }
            }
        } else if (messageText.endsWith('!') && Math.random() < .35) {
            resultResponse = "На минуточку!";
        }

        return Promise.resolve(resultResponse);
*/