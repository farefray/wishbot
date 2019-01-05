
const request = require("request"),
    cheerio = require("cheerio");

module.exports = {
    canProcess: function (ctx) {
        let regex = RegExp('шути','gmi');
        return (regex.test(ctx.message.text));
    },
    process: function (ctx) {
        let url = 'http://poetory.ru/content/list?sort=likes&page=' + [Math.floor(Math.random() * 15)] + '&per-page=30';
        let html_joke;
        request({ url: url, encoding: null }, function (error, response, body) {
            if (!error) {
                let $ = cheerio.load(body, { decodeEntities: false }),
                    joke = $(".item-text");

                html_joke = $(".item-text").eq(Math.floor(Math.random() * joke.length)).html();
                if (html_joke && html_joke.length) {
                    html_joke = html_joke.replace(/<br\s*\/?>/mg, "\n").replace(/&(lt|gt|quot);/g, function (m, p) {
                        return (p == "lt") ? "<" : (p == "gt") ? ">" : "'";
                    });
                } else {
                    html_joke = 'Произошла ошибка';
                }
            } else {
                html_joke = "Произошла ошибка: " + error
            }

            ctx.reply(html_joke);
            return Promise.resolve();
        });
    }
}