const request = require("request"),
    cheerio = require("cheerio");

const natural = require('natural');

module.exports = function () {
    this.moduleName = "image";

    this.phrases = [
        "покажи мне картинку",
        "павай картинку c",
        "покажи",
        "покажи мне"
    ];

    this.run = function (ctx, moduleConf) {
        return new Promise((resolve, reject) => {
            // lets find what we gonna search
            const ourPhrase = moduleConf.highestPhrase;
            let usersInput = moduleConf.usersInput;
            let distancedMessage = natural.LevenshteinDistance(ourPhrase, usersInput, {search: true});
            if (distancedMessage.substring) {
                usersInput = usersInput.replace(distancedMessage.substring, "");
            }

            usersInput = usersInput.trim();
            console.log('Searching for ' + usersInput);
            var uri = 'https://www.google.com.ua/search?q=' + encodeURIComponent(usersInput) + '&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiQm5ny3b7QAhVJkCwKHTuCDO4Q_AUICCgB';
            request({
                uri: uri,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                    'authority': 'www.google.com.ua',
                    'path': '/search?q=' + encodeURIComponent(usersInput) + '&oq=' + encodeURIComponent(usersInput) + '&aqs=chrome..69i57j0l5.863j0j8&sourceid=chrome&es_sm=93&ie=UTF-8',
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'cache-control': 'no-cache',
                    'cookie': 'SID=pwQ9LtS7qs82WclLKcqGluDwntiGWQzabwlCrE6hVsKIy7gYjA8NiSImlVlF18-xwxx1ag.; HSID=AiHDdo5fCSN8Pbf2h; SSID=A77ahQkTPNmJxoDpw; APISID=K7uo5aFfaImZbah0/ADYr6UM20XzFXUk7l; SAPISID=LpIBiJXOuwW8DjOE/A2KUyWzEVjWm3NAqa; NID=106=mSTp-MezH0hmbfallj76Zgmb5xxcTrWbWn1osUHpe0B0kyQLoFmVvd06aHjOd4RDz6QdgtRiMGftFOeUZkzrxEH5myP5L1FI1PXZFArFi3BXnMb1AZ31Ru3ofLQOMAr4-dJSz2gkyC3NLhzt7__TFJwFq0hKNGOFpZ-lDs7v0zcdzWMKV1AOh0UnQS-EGFhKiF9iW3wD1q8Zy9DtaXHEtB0g28u3MDVPgmEtvDs; DV=8waJBx4lumhE8NhO80xwP7SmDOeszxUK11PkT-n4TwMAAIBigLq4IEiT5QAAACzcz0qOoQyPVQAAAA',
                    'pragma': 'no-cache',
                    'x-client-data': 'CJC2yQEIpbbJAQ==',
                    'upgrade-insecure-requests': '1',
                    'x-client-data': 'CI+2yQEIo7bJAQjKisoBCPqcygEIqZ3KAQi7nsoB',
                    'x-chrome-uma-enabled': '1'
                }
            }, function (err, res, html) {
                if (err) {
                    return false;
                }

                var $ = cheerio.load(html, { decodeEntities: false, xmlMode: true });

                var result = $('div.rg_meta').map(function () {
                    var item = {
                        url: null
                    };

                    var jsoned = JSON.parse($(this).html());
                    item.url = jsoned.ou;
                    return item;
                }).get();

                var random = result[Math.floor(result.length * Math.random())];
                if (random === undefined || random['url'] === undefined) {
                    ctx.reply("Я не нашел ничего подходящего.");
                } else {
                    ctx.replyWithPhoto(random['url'], {
                        caption: 'Вот что я нашел',
                        parse_mode: 'Markdown'
                    })
                }

                return resolve();
            });
        });
    }

    return this;
}
