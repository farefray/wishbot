
module.exports = {
    active: function (ctx) {
        let regex = RegExp('привет','gmi');
        return (regex.test(ctx.message.text));
    },
    process: function (ctx) {
        ctx.reply('Хеллоу');
        return Promise.resolve();
    }
}