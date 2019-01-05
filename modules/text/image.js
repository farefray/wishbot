const request = require("request"),
    cheerio = require("cheerio");

module.exports = {
    canProcess: function (ctx) {
        let regex = RegExp('покажи', 'gmi');
        return (regex.test(ctx.message.text));
    },
    process: function (ctx) {
        var txt = ctx.message.text.toLowerCase().split('покажи');
        txt = txt[txt.length - 1].trim();
        if (txt.substring(txt.length - 1) == "а") {
            txt = txt.substring(0, txt.length - 1);
        }

        if (txt.substring(txt.length - 1) == "у") {
            txt = txt.substring(0, txt.length - 1) + "а";
        }

        if (txt.substring(txt.length - 1) == "ю") {
            txt = txt.substring(0, txt.length - 1) + "я";
        }

        var elements = txt.split(' '), new_str = "";
        elements.forEach(function (item, i) {
            if (item.substring(item.length - 2) == "ую") {
                item = item.substring(0, item.length - 2) + "ая";
            }

            new_str += " " + item;
        });

        txt = new_str;

        var uri = 'https://www.google.com.ua/search?q=' + encodeURIComponent(txt.trim()) + '&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiQm5ny3b7QAhVJkCwKHTuCDO4Q_AUICCgB';
        request({
            uri: uri,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                'authority': 'www.google.com.ua',
                'path': '/search?q=' + encodeURIComponent(txt.trim()) + '&oq=' + encodeURIComponent(txt.trim()) + '&aqs=chrome..69i57j0l5.863j0j8&sourceid=chrome&es_sm=93&ie=UTF-8',
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
            console.log(err);
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
                    caption: 'Вот' + txt,
                    parse_mode: 'Markdown'
                })
            }

            return Promise.resolve();
        });
    }
}