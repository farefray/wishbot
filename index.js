require('dotenv').config()

const fs = require('fs');
const Telegraf = require('telegraf');
const app = require('./app').getInstance();
const session = require('telegraf/session')
const path = require('path');

// Train the classifier
const questionFiles = fs.readdirSync(path.join("./", "modules", "text"));
questionFiles.forEach((file) => {
    const dataFile = require(`./modules/text/${file}`);
    const dataName = file.split(".")[0];
    app.modules.set(dataName, dataFile);

    console.log(`Data loaded: ${dataName}`);
});

// Bot creation
const bot = new Telegraf(process.env.bot_token);
bot.use(session());

bot.use((ctx, next) => {
    console.log('Message from user', ctx.chat.username, 'recieved:', ctx.message.text)

    if (!ctx.message.text) {
        return next(ctx);
    }

    if (ctx.message.text == '/wipe') {
        ctx.session = {}
        return ctx.reply('session wiped').then(() => next(ctx))
    }

    let appealResult = app.getAppeal(ctx.message.text);
    if (ctx.chat.type === 'private' || appealResult.is) {
        let appResult = app.ai(ctx.message.text.replace(appealResult.appeal, ''));
        if (appResult.moduleName) {
            app.process(appResult, ctx).then(() => {
                return next(ctx);
            });
        } else {
            return next(ctx);
        }
    } else {
        return next(ctx);
    }
})

bot.command((ctx) => {
    console.log('Command from user', ctx.chat.username, 'recieved:', ctx.message.text);
    return controller.command(ctx).then(() => {
        // ctx.reply('Command done.')
        return;
    })
})

// Critical error handler
bot.catch((err) => {
    console.log('Ooops', err)
})

// We can get bot nickname from bot informations. This is particularly useful for groups.
bot.telegram.getMe().then((bot_informations) => {
    bot.options.username = bot_informations.username
    console.log("Server has initialized bot nickname. Nick: " + bot_informations.username)
})


// Start bot polling in order to not terminate Node.js application.
bot.startPolling()