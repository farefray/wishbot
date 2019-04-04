const cheerio = require("cheerio");
const fetch = require('node-fetch');
const NaturalHelper = require('../helpers/natural');
const AzHelper = require('../helpers/az');
const MIN_REPLY_LENGTH = 10;

module.exports = function () {
    this.moduleName = "wiki";

    this.phrases = [
        "что такое",
        "кто такой",
        "кто такая",
        "кто такие"
    ];

    this.run = function (ctx, moduleConf) {
        return new Promise((resolve) => {
            // lets find what we gonna search
            const stem = NaturalHelper.extractStem(moduleConf.usersInput, moduleConf.highestPhrase);
            const azProcessed = AzHelper.getNormalized(stem);
            console.log('Wiki for ' + azProcessed);
            fetch("https://ru.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(azProcessed) + "&go=Go", {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3","accept-language":"ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7","upgrade-insecure-requests":"1"},"referrer":"https://www.wikipedia.org/","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"})
            .then(res => res.text())
            .then(body => {
                const $ = cheerio.load(body, { decodeEntities: false });
                const info = $('.mw-parser-output > p');
                let responseText = '';
                if (info.length === 1) {
                    // probably not clear statement. Has ul inside with possible variants
                    const possibleVariants = $('.mw-parser-output > ul');
                    if (possibleVariants.length > 0) {
                        responseText = $(info[0]).html();
                        responseText += '</br>';
                        responseText += $(possibleVariants[0]).html().replace('<ul>', '<ol>').replace('</ul>', '</ol>');
                        responseText = responseText.toMessage();
                    }
                } else if (info.length > 0) {
                    responseText = $(info[0]).html().toMessage();

                    if (responseText.length <= MIN_REPLY_LENGTH && !!info[1]) {
                        responseText = $(info[1]).html().toMessage();
                    }
                }

                if (responseText.length) {
                    const linksRegex = /\[[1-9]\]/gmi;
                    return ctx.replyWithHTML(responseText.replace(linksRegex, ''));
                }

                ctx.reply('Я ничего об этом не знаю');
            }).
            catch(e => {
                const error = e;
                ctx.reply('К сожалению, в ходе выполнения операции произошла ошибка.');
            });
        });
    };

    return this;
};
