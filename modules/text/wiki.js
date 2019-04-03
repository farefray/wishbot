const cheerio = require("cheerio");
const fetch = require('node-fetch');
const natural = require('natural');
const htmlToText = require('html-to-text');

module.exports = function () {
    this.moduleName = "wiki";

    this.phrases = [
        "что такое"
    ];

    this.run = function (ctx, moduleConf) {
        return new Promise((resolve) => {
            // lets find what we gonna search
            const ourPhrase = moduleConf.highestPhrase;
            let usersInput = moduleConf.usersInput;
            let distancedMessage = natural.LevenshteinDistance(ourPhrase, usersInput, {search: true});
            if (distancedMessage.substring) {
                usersInput = usersInput.replace(distancedMessage.substring, "");
            }

            usersInput = usersInput.trim();
            console.log('Wiki for ' + usersInput);

            fetch("https://ru.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(usersInput) + "&go=Go", {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3","accept-language":"ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7","upgrade-insecure-requests":"1"},"referrer":"https://www.wikipedia.org/","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"})
            .then(res => {
                console.log(res);
                return res.text();
            })
            .then(body => {
                const $ = cheerio.load(body, { decodeEntities: false });
                const info = $('.mw-parser-output > p');
                if (info.length > 0) {
                    let responseText = $(info[0]).html();
                    ctx.replyWithHTML(htmlToText.fromString(responseText, {
                        wordwrap: false,
                        ignoreHref: true,
                        format: {
                            heading: function (elem, fn, options) {
                                return '<b>' + fn(elem.children, options) + '</b>';
                            }
                        }
                    }));
                }
            }).
            catch(e => {
                const error = e;
                ctx.reply('К сожалению, в ходе выполнения операции произошла ошибка.');
            });
        });
    }

    return this;
}
