
const http = require('http');

const request = require("request"),
    cheerio = require("cheerio");

const Buffer = require('buffer').Buffer;
//const Iconv = require('iconv').Iconv;

var content = "";

var config = {
    "name": "желание",
    "logic": [
        {
            "word": "привет",
            "action": "Здравствуй"
        },
        {
            "canIgnoreName": true,
            "word": "шути",
            "action": function () {
                var url = 'http://poetory.ru/content/list?sort=likes&page=' + [Math.floor(Math.random() * 15)] + '&per-page=30';
                request({ url: url, encoding: null }, function (error, response, body) {
                    if (!error) {
                        /*body = new Buffer(body, 'binary');
                        conv = new Iconv('windows-1251', 'utf8');
                        body = conv.convert(body).toString();*/

                        var $ = cheerio.load(body, { decodeEntities: false }),
                            joke = $(".item-text");

                        var html_joke = $(".item-text").eq(Math.floor(Math.random() * joke.length)).html();
                        if (html_joke && html_joke.length) {
                            html_joke = html_joke.replace(/<br\s*\/?>/mg, "\n").replace(/&(lt|gt|quot);/g, function (m, p) {
                                return (p == "lt") ? "<" : (p == "gt") ? ">" : "'";
                            });
                        } else {
                            html_joke = 'Произошла ошибка';
                        }

                        return html_joke;
                    } else {

                        return "Произошла ошибка: " + error
                    }
                });
                //return "Нет.";
            }
        },
        {
            "word": "погода",
            "action": function () {
                request("http://www.wunderground.com/cgi-bin/findweather/getForecast?&query=47.887403899999995,33.3879114", function (error, response, body) {
                    if (!error) {
                        var $ = cheerio.load(body),
                            temperature = $("[data-variable='temperature'] .wx-value").html(),
                            feels = $("[data-variable='feelslike'] .wx-value").html();

                        return "Текущая температура " + temperature + " °C, по ощущениям " + feels + " °C";
                    } else {
                        return "Произошла ошибка: " + error;
                    }
                });
            }
        },
        {
            "word": "мудрость",
            "action": function () {
                var num_quotes = 3;
                var rand_no = Math.ceil(num_quotes * Math.random());
                switch (rand_no) {
                    case 1: {
                        request('https://www.goodreads.com/quotes_of_the_day', function (error, response, body) {
                            var $ = cheerio.load(body);
                            const quotes = $('.quoteText').text().trim();
                            return quotes.split('//<!')[0].trim().split('―')[0].trim();
                        });

                        break;
                    }
                    case 2: {
                        request('http://www.brainyquote.com/quotes_of_the_day.html', function (error, response, body) {
                            var $ = cheerio.load(body);
                            return $('.bqQuoteLink').eq(0).text().trim();
                        });

                        break;
                    }
                    case 3: {
                        request('http://www.eduro.com/', function (error, response, body) {
                            var $ = cheerio.load(body);
                            return $('.article dailyquote p').eq(0).text().trim();
                        });

                        break;
                    }
                }
            }
        },
        {
            "canIgnoreName": true,
            "word": "гифка",
            "action": function (messageText) {

                var txt = messageText.toLowerCase().split('гифка');
                txt = txt[txt.length - 1].trim();
                /*if (txt.substring(txt.length-1) == "а")
                {
                    txt = txt.substring(0, txt.length-1);
                }*/

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

                var uri = 'https://www.google.com.ua/search?q=' + encodeURIComponent(txt.trim()) + '&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiQm5ny3b7QAhVJkCwKHTuCDO4Q_AUICCgB&tbs=itp:animated';
                var result = [];
                console.log(uri);
                request({
                    uri: uri,
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
                        'authority': 'www.google.com.ua',
                        'path': '/search?q=' + encodeURIComponent(txt.trim()) + '&oq=' + encodeURIComponent(txt.trim()) + '&aqs=chrome..69i57j0l5.863j0j8&sourceid=chrome&es_sm=93&ie=UTF-8&tbs=itp:animated',
                        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'cache-control': 'no-cache',
                        'cookie': 'GoogleAccountsLocale_session=uk; SID=sgM9LhHTCLSnY2a_TJQauQUKnkdWY76UNFyIPI1vYwukukVqbCnCawY_LfFchfMWcLKoCw.; HSID=AQsbTR4gA6VQ6lly0; SSID=ATKwDi3kM9tpV7Z0b; APISID=iBLpH3KD3E1HoOS5/ABeYs14_Z2htYKWOc; SAPISID=DC_knTFe0ketK9hf/AkO0jscVfwDLKTNJr; gsScrollPos=; NID=91=aHD78dyWxlYeiG9Q39PTzBJ1M_cl7yCStmnEXP-Raz8jS0E4pzTidYJ9xmpUyXiu88vF5qMqf4s8IZrVSDwzfwV7llEv1WSzJnqr3EkjVUWGrELjCIvWCvBPbOYZrAfP-nmlVog5YKk2Sd_ppsUIhUQ91VRPEBf6Bj5EG-qqmZpSMV0T_FFIUzpjGryw3iEIAgOYVAAHFFFeXYT0nY-1NvctX7BeUh469wbtLg8V5gRs5WhBzHe60YdbXTy9kmTB9fk10UzDmECrLlviXHsjcCJFPRiV_G7k-aPuwBOAIVF4kG6T1SH9wNFDmsKqjD4PXAEwuGRA; DV=8gaJBx4lumhUdHYlUOqQ27KALAsrsYp1t9qk4xdSSgAAAGi_HyiQoPh5HgAAAHYmAof2gwtfCAAAwKWzpxMh7oMhXuQBAA',
                        'pragma': 'no-cache',
                        'x-client-data': 'CJC2yQEIpbbJAQ=='
                    }
                }, function (err, res, html) {
                    if (err) {
                        return false;
                    }

                    var $ = cheerio.load(html, { decodeEntities: false, xmlMode: true });
                    console.log(err);


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
                        return "Я не нашел ничего подходящего.";
                    } else {
                        return random['url'], { caption: 'Вот' + txt };
                    }
                });
            }
        }
    ],
}

function sendGif(aChatId, image, caption) {
    bot.sendDocument(aChatId, image, caption);
}

function sendPicByBot(aChatId, image, caption) {
    bot.sendPhoto(aChatId, image, caption);
}


if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        value: function (searchString, position) {
            var subjectString = this.toString();
            if (position === undefined || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        }
    });
}

module.exports = config;