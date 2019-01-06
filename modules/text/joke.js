
const request = require("request"),
    cheerio = require("cheerio");

module.exports = function () {
    this.moduleName = "joke";

    this.phrases = [
        "пошути",
        "мне грустно",
        "давай весели меня",
        "давай шутку",
        "пошути смешно",
        "пожалуйста пошути"
    ];
    
    this.run = function (ctx) {
        return new Promise((resolve, reject) => {
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
                return resolve();
            });
        });
    }

    return this;
}