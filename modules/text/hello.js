
module.exports = function () {
    this.moduleName = "hello";

    this.phrases = [
        "привет",
        "хеллоу",
        "здравствуй",
        "хай",
        "алоха",
        "дратути",
        "драти"
    ];

    this.run = function (ctx) {
        return new Promise((resolve, reject) => {
            ctx.reply(this.phrases[Math.floor(Math.random()*this.phrases.length)]);
            resolve();
        });
    }

    return this;
}