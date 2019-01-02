const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.bot_token, {
    polling: true
});

global.bot = bot;
const controller = require("./controller");

bot.getMe().then(function (me) {
    controller.init(me);
});

bot.on('text', function (msg) {
    controller.on('text', msg)
});

