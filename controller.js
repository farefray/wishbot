const helpers = require('./helpers');
const config = require('./modules');

const Controller = () => ({
    init(me) {
        console.log('Hello! My name is %s!', me.first_name);
        console.log('My id is %s.', me.id);
        console.log('And my username is @%s.', me.username);
    },

    on(eventName, ...args) {
        this[eventName](...args);
    },

    text(msg) {
        var { chat, text} = msg;
        let messageText = text;
        let messageChatId = chat && chat.id;

        var active = true;
        if (config.name.length && messageText.toLowerCase().indexOf(config.name.toLowerCase()) !== 0) {
            active = false;
        }

        var actioned = false;
        config.logic.reverse().forEach(function (item, i) {
            if ((item.canIgnoreName || active) && !actioned) {
                if (messageText.toLowerCase().indexOf(item.word.toLowerCase()) !== -1) {
                    actioned = true;
                    if (helpers.isFunction(item.action)) {
                        var result = item.action(messageChatId, messageText);
                        if (result && result.length) {
                            bot.sendMessage(messageChatId, result);
                        }
                    } else {
                        bot.sendMessage(messageChatId, item.action);
                    }

                    return true;
                }
            }
        });

        if (active) {
            if (!actioned) {
                if (messageText.endsWith('?')) {
                    var rand_no = getRandomInt(1, 3);
                    switch (rand_no) {
                        case 1: {
                            bot.sendMessage(messageChatId, "Да");
                            break;
                        }
                        case 2: {
                            bot.sendMessage(messageChatId, "Нет");
                            break;
                        }
                        case 3: {
                            bot.sendMessage(messageChatId, "Не знаю");
                            break;
                        }
                    }
                }
            }
        } else {
            if (messageText.endsWith('!') && Math.random() < .35) {
                bot.sendMessage(messageChatId, "На минуточку!");
            }
        }
    }
});

module.exports = Controller();