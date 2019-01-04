const helpers = require('./helpers');
const config = require('./modules');

const selfName = "желание";
const Controller = () => ({
    middleware(message) {
        let { text: messageText } = message;

        let isAppeal = (messageText.toLowerCase().indexOf(selfName.toLowerCase()) !== 0);

        let actioned = false;
        let resultResponse = "";
        config.logic.reverse().forEach(function (item, i) {
            if ((item.canIgnoreName || isAppeal) && !actioned) {
                if (messageText.toLowerCase().indexOf(item.word.toLowerCase()) !== -1) {
                    actioned = true;
                    if (helpers.isFunction(item.action)) {
                        let result = item.action(messageChatId, messageText);
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
    }
});

module.exports = Controller();