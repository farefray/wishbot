var TelegramBot = require('node-telegram-bot-api');
var http = require('http');

var Buffer = require('buffer').Buffer;
var Iconv  = require('iconv').Iconv;

var token = '271014804:AAFssdlnwPjjml_mGZoH9wGGX2V8P7zv8_I';
var botOptions = {
    polling: true
};

var request = require("request"),
    cheerio = require("cheerio");

var bot = new TelegramBot(token, botOptions);
 
bot.getMe().then(function(me)
{
    console.log('Hello! My name is %s!', me.first_name);
    console.log('My id is %s.', me.id);
    console.log('And my username is @%s.', me.username);
});
 

var content = "";

var config = {
    "name":"желание",
    "logic":[
        {
            "word":"привет",
            "action": "Здравствуй"
        },
        {
        	"canIgnoreName": true,
            "word":"шути",
            "action": function (messageChatId) {
                var url = 'http://poetory.ru/content/list?sort=likes&page=' + [Math.floor(Math.random()*15)] + '&per-page=30';
                request({url:url, encoding:null}, function (error, response, body) {
                    if (!error) {
                        /*body = new Buffer(body, 'binary');
                        conv = new Iconv('windows-1251', 'utf8');
                        body = conv.convert(body).toString();*/

                        var $ = cheerio.load(body, {decodeEntities: false}),
                            joke = $(".item-text");

                        var html_joke = $(".item-text").eq(Math.floor(Math.random()*joke.length)).html();
                        if(html_joke && html_joke.length) {
                        	html_joke = html_joke.replace(/<br\s*\/?>/mg,"\n").replace(/&(lt|gt|quot);/g, function (m, p) { 
    return (p == "lt")? "<" : (p == "gt") ? ">" : "'";
  });
                        } else {
                        	html_joke = 'Произошла ошибка';
                        }
                        
                        sendMessageByBot(messageChatId, html_joke);
                    } else {
                        
                        sendMessageByBot(messageChatId, "Произошла ошибка: " + error);
                    }
                });
                //return "Нет.";
            }
        },
        {
            "word":"погода",
            "action": function (messageChatId) {
                request("http://www.wunderground.com/cgi-bin/findweather/getForecast?&query=47.887403899999995,33.3879114", function (error, response, body) {
                    if (!error) {
                        var $ = cheerio.load(body),
                            temperature = $("[data-variable='temperature'] .wx-value").html(),
                            feels = $("[data-variable='feelslike'] .wx-value").html();

                        sendMessageByBot(messageChatId, "Текущая температура " + temperature + " °C, по ощущениям " + feels + " °C");
                    } else {
                        sendMessageByBot(messageChatId, "Произошла ошибка: " + error);
                    }
                });
            }
        },
        {
            "word":"мудрость",
            "action": function (messageChatId) {
                var num_quotes = 3;
                var rand_no = Math.ceil(num_quotes * Math.random());
                switch(rand_no) {
                    case 1: {
                        request('https://www.goodreads.com/quotes_of_the_day', function (error, response, body) {
                            var $ = cheerio.load(body);
                            const quotes = $('.quoteText').text().trim();
                            sendMessageByBot(messageChatId, quotes.split('//<!')[0].trim().split('―')[0].trim());
                        });

                        break;
                    }
                    case 2: {
                        request('http://www.brainyquote.com/quotes_of_the_day.html', function (error, response, body) {
                            var $ = cheerio.load(body);
                            sendMessageByBot(messageChatId, $('.bqQuoteLink').eq(0).text().trim());
                        });

                        break;
                    }
                    case 3: {
                        request('http://www.eduro.com/', function (error, response, body) {
                            var $ = cheerio.load(body);
                            sendMessageByBot(messageChatId, $('.article dailyquote p').eq(0).text().trim());
                        });

                        break;
                    }
                }
            }
        },
        {
            "canIgnoreName": true,
            "word":"гифка",
            "action": function (messageChatId, messageText) {

                var txt = messageText.toLowerCase().split('гифка');
                txt = txt[txt.length - 1].trim();
                /*if (txt.substring(txt.length-1) == "а")
                {
                    txt = txt.substring(0, txt.length-1);
                }*/

                if (txt.substring(txt.length-1) == "у")
                {
                    txt = txt.substring(0, txt.length-1) + "а";
                }

                if (txt.substring(txt.length-1) == "ю")
                {
                    txt = txt.substring(0, txt.length-1) + "я";
                }

                var elements = txt.split(' '), new_str = "";
                elements.forEach(function(item, i) {
                    if (item.substring(item.length-2) == "ую")
                    {
                        item = item.substring(0, item.length-2) + "ая";
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
                    'authority':'www.google.com.ua',
                    'path': '/search?q=' + encodeURIComponent(txt.trim()) + '&oq=' + encodeURIComponent(txt.trim()) + '&aqs=chrome..69i57j0l5.863j0j8&sourceid=chrome&es_sm=93&ie=UTF-8&tbs=itp:animated',
                    'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'cache-control':'no-cache',
                    'cookie':'GoogleAccountsLocale_session=uk; SID=sgM9LhHTCLSnY2a_TJQauQUKnkdWY76UNFyIPI1vYwukukVqbCnCawY_LfFchfMWcLKoCw.; HSID=AQsbTR4gA6VQ6lly0; SSID=ATKwDi3kM9tpV7Z0b; APISID=iBLpH3KD3E1HoOS5/ABeYs14_Z2htYKWOc; SAPISID=DC_knTFe0ketK9hf/AkO0jscVfwDLKTNJr; gsScrollPos=; NID=91=aHD78dyWxlYeiG9Q39PTzBJ1M_cl7yCStmnEXP-Raz8jS0E4pzTidYJ9xmpUyXiu88vF5qMqf4s8IZrVSDwzfwV7llEv1WSzJnqr3EkjVUWGrELjCIvWCvBPbOYZrAfP-nmlVog5YKk2Sd_ppsUIhUQ91VRPEBf6Bj5EG-qqmZpSMV0T_FFIUzpjGryw3iEIAgOYVAAHFFFeXYT0nY-1NvctX7BeUh469wbtLg8V5gRs5WhBzHe60YdbXTy9kmTB9fk10UzDmECrLlviXHsjcCJFPRiV_G7k-aPuwBOAIVF4kG6T1SH9wNFDmsKqjD4PXAEwuGRA; DV=8gaJBx4lumhUdHYlUOqQ27KALAsrsYp1t9qk4xdSSgAAAGi_HyiQoPh5HgAAAHYmAof2gwtfCAAAwKWzpxMh7oMhXuQBAA',
                    'pragma':'no-cache',
                    'x-client-data':'CJC2yQEIpbbJAQ=='
                  }
                }, function(err, res, html) {
                    if (err) {
                        return false;
                    }

                    var $ = cheerio.load(html, {decodeEntities: false, xmlMode: true});
                    console.log(err);


                    var result = $('div.rg_meta').map(function() {
                        var item = {
                          url: null
                        };

                        var jsoned = JSON.parse($(this).html());
                        item.url = jsoned.ou;
                        return item;
                    }).get();

                    var random = result[Math.floor(result.length * Math.random())];
                    if(random === undefined || random['url'] === undefined) {
                        sendMessageByBot(messageChatId, "Я не нашел ничего подходящего.");
                    } else {
                        sendGif(messageChatId, random['url'], {caption: 'Вот' + txt});
                    }
                });
            }
        },
        {
            "canIgnoreName": true,
            "word":"стата",
            "action": function (messageChatId, messageText) {
                
            }
        },        
        {
            "canIgnoreName": true,
            "word":"покажи",
            "action": function (messageChatId, messageText) {

                var txt = messageText.toLowerCase().split('покажи');
                txt = txt[txt.length - 1].trim();
                if (txt.substring(txt.length-1) == "а")
                {
                    txt = txt.substring(0, txt.length-1);
                }

                if (txt.substring(txt.length-1) == "у")
                {
                    txt = txt.substring(0, txt.length-1) + "а";
                }

                if (txt.substring(txt.length-1) == "ю")
                {
                    txt = txt.substring(0, txt.length-1) + "я";
                }

                var elements = txt.split(' '), new_str = "";
                elements.forEach(function(item, i) {
                    if (item.substring(item.length-2) == "ую")
                    {
                        item = item.substring(0, item.length-2) + "ая";
                    }

                    new_str += " " + item;
                });

                txt = new_str;

                var uri = 'https://www.google.com.ua/search?q=' + encodeURIComponent(txt.trim()) + '&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiQm5ny3b7QAhVJkCwKHTuCDO4Q_AUICCgB';
                var result = [];
                console.log(uri);
                request({
                  uri: uri,
                  method: 'GET',
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                    'authority':'www.google.com.ua',
                    'path': '/search?q=' + encodeURIComponent(txt.trim()) + '&oq=' + encodeURIComponent(txt.trim()) + '&aqs=chrome..69i57j0l5.863j0j8&sourceid=chrome&es_sm=93&ie=UTF-8',
                    'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'cache-control':'no-cache',
                    'cookie':'SID=pwQ9LtS7qs82WclLKcqGluDwntiGWQzabwlCrE6hVsKIy7gYjA8NiSImlVlF18-xwxx1ag.; HSID=AiHDdo5fCSN8Pbf2h; SSID=A77ahQkTPNmJxoDpw; APISID=K7uo5aFfaImZbah0/ADYr6UM20XzFXUk7l; SAPISID=LpIBiJXOuwW8DjOE/A2KUyWzEVjWm3NAqa; NID=106=mSTp-MezH0hmbfallj76Zgmb5xxcTrWbWn1osUHpe0B0kyQLoFmVvd06aHjOd4RDz6QdgtRiMGftFOeUZkzrxEH5myP5L1FI1PXZFArFi3BXnMb1AZ31Ru3ofLQOMAr4-dJSz2gkyC3NLhzt7__TFJwFq0hKNGOFpZ-lDs7v0zcdzWMKV1AOh0UnQS-EGFhKiF9iW3wD1q8Zy9DtaXHEtB0g28u3MDVPgmEtvDs; DV=8waJBx4lumhE8NhO80xwP7SmDOeszxUK11PkT-n4TwMAAIBigLq4IEiT5QAAACzcz0qOoQyPVQAAAA',
                    'pragma':'no-cache',
                    'x-client-data':'CJC2yQEIpbbJAQ==',
                    'upgrade-insecure-requests': '1',
                    'x-client-data':'CI+2yQEIo7bJAQjKisoBCPqcygEIqZ3KAQi7nsoB',
                    'x-chrome-uma-enabled':'1'
                  }
                }, function(err, res, html) {
                    console.log(err);
                    if (err) {
                        return false;
                    }

                    var $ = cheerio.load(html, {decodeEntities: false, xmlMode: true});
                    //console.log($.html());


                    var result = $('div.rg_meta').map(function() {
                        var item = {
                          url: null
                        };

                        var jsoned = JSON.parse($(this).html());
                        item.url = jsoned.ou;
                        return item;
                    }).get();

                    var random = result[Math.floor(result.length * Math.random())];
                    if(random === undefined || random['url'] === undefined) {
                		sendMessageByBot(messageChatId, "Я не нашел ничего подходящего.");
                    } else {
                    	sendPicByBot(messageChatId, random['url'], {caption: 'Вот' + txt});
                	}
                });
            }
        },
    ],
}

function sendGif(aChatId, image, caption) {
    bot.sendDocument(aChatId, image, caption);
}

function sendPicByBot(aChatId, image, caption)
{
    bot.sendPhoto(aChatId, image, caption);
}

var logic = {
    message: function(messageText, messageChatId) {
        var active = true;
        if(config.name.length && messageText.toLowerCase().indexOf(config.name.toLowerCase()) !== 0) {
            active = false;
        }
        
        var actioned = false;
        config.logic.reverse().forEach(function(item, i) {
            if((item.canIgnoreName || active) && !actioned) {
                if(messageText.toLowerCase().indexOf(item.word.toLowerCase()) !== -1) {
                    actioned = true;
                    if(isFunction(item.action)) {
                        var result = item.action(messageChatId, messageText);
                        if(result && result.length) {
                            sendMessageByBot(messageChatId, result);
                        }
                    } else {
                        sendMessageByBot(messageChatId, item.action);
                    }

                    return true;
                }
            }
        });

        if(active) {
            if(!actioned) {
                if(messageText.endsWith('?')) {
                    var rand_no = getRandomInt(1, 3);
                    switch(rand_no) {
                        case 1: {
                            sendMessageByBot(messageChatId, "Да");
                            break;
                        }
                        case 2: {
                            sendMessageByBot(messageChatId, "Нет");
                            break;
                        }
                        case 3: {
                            sendMessageByBot(messageChatId, "Не знаю");
                            break;
                        }
                    }
                }
            }
        } else {
            if(messageText.endsWith('!') && Math.random() < .35) {
                sendMessageByBot(messageChatId, "На минуточку!");
            }
        }
    }
}

bot.on('text', function(msg)
{
    var messageChatId = msg.chat.id;
    var messageText = msg.text;
    var messageDate = msg.date;
    var messageUser = msg.from.username;
    logic.message(messageText, messageChatId);
});
 
function sendMessageByBot(aChatId, aMessage)
{
    bot.sendMessage(aChatId, aMessage);
}


function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, 'endsWith', {
    value: function(searchString, position) {
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

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
