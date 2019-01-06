


var m_activeContexts = {};

function getSessionKey(ctx) {
    if (ctx.from && ctx.chat) {
        return `${ctx.from.id}:${ctx.chat.id}`
    } else if (ctx.from && ctx.inlineQuery) {
        return `${ctx.from.id}:${ctx.from.id}`
    }
    return null
}

function millisToMinutesAndSeconds(millis) {
    var minus = millis < 0 ? "-" : ""
    millis = Math.abs(millis)
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minus + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function stopTimers(ctx) {
    var sessionKey = getSessionKey(ctx);
    var interval = m_activeContexts[sessionKey]
    clearInterval(interval)
    m_activeContexts[sessionKey] = null
    ctx.session.canEdit = false
    ctx.session.timers = []
}

const intervalHandler = (ctx) => {
    var reply = '';
    var invalidatedCount = 0;
    ctx.session.timers.forEach(t => {
        var timeRest = t.end - Date.now()
        if (timeRest <= 0) {
            if (!t.invalidated) {
                t.invalidated = true
                ctx.reply('Таймер завершен: ' + (t.label.length > 0 ? ' ' + t.label : '') + ' ' + millisToMinutesAndSeconds(t.time))
            }
        }
        reply += ('\n' + millisToMinutesAndSeconds(timeRest) + (t.label.length > 0 ? ` — ${t.label}` : '') + (t.invalidated ? ' *EXPIRED*' : ''))

        if (t.invalidated) {
            invalidatedCount++
        }
    })

    if (reply.length > 0) {
        if (ctx.session.canEdit) {
            ctx.telegram.editMessageText(ctx.session.editMessageChatId, ctx.session.editMessageId, ctx.session.editInlineMessageId, reply)
        }
        else {
            ctx.reply(reply).then((replyCtx) => {
                ctx.session.editMessageId = replyCtx.message_id
                ctx.session.editInlineMessageId = replyCtx.inline_message_id
                ctx.session.editMessageChatId = replyCtx.chat.id
                ctx.session.canEdit = true
            })
        }
    }
    else {
        console.log('Nothing to reply')
    }

    if (invalidatedCount == ctx.session.timers.length) {
        stopTimers(ctx)
    }
}

module.exports = function () {
    this.moduleName = "timers";

    this.phrases = [
        "таймер"
    ];

    this.run = function (ctx) {
        let msg = ctx.message.text;
        var match = msg.match(/^\/\d{1,5}/);
        // create timer command
        var label = msg.substring(match[0].length).trim() || ""
        var time = parseInt(match[0].substring(1));
        if (time > 0 && time <= 15) {
            time = time * 60 * 1000

            var timers = ctx.session.timers || []
            var now = Date.now()
            var end = now + time

            ctx.reply('Таймер запущен.')
            timers.push({ time: time, label: label, created: now, end: end, invalidated: false })
            ctx.session.timers = timers

            var sessionKey = getSessionKey(ctx);

            if (m_activeContexts[sessionKey] == null) {
                m_activeContexts[sessionKey] = setInterval(function () {
                    intervalHandler(ctx);
                }, 5000)
            }
        } else {
            ctx.reply('Слишком длинный, you know, sorry.')
        }
    }

    return this;
}


/*

bot.command('stop', (ctx) => {
    stopTimers(ctx)
    return ctx.reply('Cleared all timers.')
})

bot.command('cancel', (ctx) => {
    stopTimers(ctx)
    return ctx.reply('Cleared all timers.')
})

*/