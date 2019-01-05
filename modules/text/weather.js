
const request = require("request");
const cheerio = require("cheerio");

const weatherURL = "https://api-ak.wunderground.com/api/d8585d80376a429e/conditions/labels/lang:EN/units:metric/bestfct:1/v:2.0/q/Ukraine/vinnytsia.json?ttl=120";
module.exports = {
    canProcess: function (ctx) {
        let regex = RegExp('погода','gmi');
        return (regex.test(ctx.message.text));
    },
    process: function (ctx) {
        let reply;
        request(weatherURL,
            function (error, response, body) {
                let reply;
                if (!error) {
                    let res = JSON.parse(body);
                    let location = res.response.location.name;
                    let { condition, temperature, wind_speed, feelslike, icon_url } = res.current_observation;
                    reply = `Current condition in ${location}: ${condition}, ${temperature} °C, feels like ${feelslike} °C. Wind speed: ${wind_speed} m/s.`;
                } else {
                    reply = "Произошла ошибка: " + error;
                }

                ctx.reply(reply);
                return Promise.resolve();
            }
        );
    }
}