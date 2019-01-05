require('dotenv').config()
const Telegraf = require('telegraf')
const { Extra, Markup } = Telegraf
const session = require('telegraf/session')

// own logic
const controller = require("./controller");

// Safe get
const get = (path, object) =>
    path.reduce((xs, x) =>
        (xs && xs[x]) ? xs[x] : null, object)

// Bot creation
const bot = new Telegraf(process.env.bot_token);
bot.use(session());

global.bot = bot; // Ouch!

bot.use((ctx, next) => {
    console.log('Message from user', ctx.chat.username, 'recieved:', ctx.message.text)
    if (ctx.message.text == '/wipe') {
        ctx.session = {}
        return ctx.reply('session wiped').then(() => next(ctx))
    }
    
    return controller.middleware(ctx).then((result) => {
        console.log(result);
        return next(ctx);
    })
})

bot.command((ctx) => {
    console.log('Command from user', ctx.chat.username, 'recieved:', ctx.message.text);
    return controller.command(ctx).then((responseText) => {
        // ctx.reply('Command done.')
        return;
    })
})

bot.start((ctx) => {
    ctx.reply('start')
})

bot.command('stop', (ctx) => {
    stopTimers(ctx)
    return ctx.reply('Cleared all timers.')
})

bot.command('cancel', (ctx) => {
    stopTimers(ctx)
    return ctx.reply('Cleared all timers.')
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