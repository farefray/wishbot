const htmlToText = require('html-to-text');

if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        value: function (searchString, position) {
            var subjectString = this.toString();
            if (!position || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        }
    });
}

if (!String.prototype.toMessage) {
    const allowedTags = ['<b>', '</b>', '<i>', '</i>', '<code>', '</code>', '<pre>', '</pre>'];

    const tagsMap = {
        '<li>': '*',
        '</li>': '\r\n'
    };

    const tagRegex = /<[^>]+>/igm;
    Object.defineProperty(String.prototype, 'toMessage', {
        value: function () {
            let originalString = this;
            const matches = originalString.match(tagRegex);
            matches.map(res => {
                if (!allowedTags.includes(res)) {
                    if (tagsMap[res]) {
                        originalString = originalString.replace(res, tagsMap[res]);
                    } else {
                        originalString = originalString.replace(res, '');
                    }
                }
            });

            return originalString;
        }
    });
}

if (!String.prototype.fromHtml) {
    Object.defineProperty(String.prototype, 'fromHtml', {
        value: function () {
            return htmlToText.fromString(this, {
                wordwrap: false,
                ignoreHref: true,
                format: {
                    heading: function (elem, fn, options) {
                        return '<b>' + fn(elem.children, options) + '</b>';
                    }
                }
            })
        }
    });
}

