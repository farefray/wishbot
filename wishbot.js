const TelegramBot = require('node-telegram-bot-api');
const token = '271014804:AAFssdlnwPjjml_mGZoH9wGGX2V8P7zv8_I';

const bot = new TelegramBot(token, {
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

