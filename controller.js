const allModules = require('./modules');

const selfName = "желание";
const Controller = () => ({
    command(ctx) {
        let activeModule = null;
        allModules.commandModules.every(function(element, index) {
            if (element.canProcess(ctx)) {
                activeModule = element;
                return false; // funny way for break in foreach
            }

            return true;
        });

        if (activeModule) {
            return Promise.resolve(activeModule.process(ctx));
        }
        
        return Promise.resolve();
    },
    middleware(ctx) {
        let activeModule = null;
        allModules.textModules.every(function(element, index) {
            if (element.canProcess(ctx)) {
                activeModule = element;
                return false; // funny way for break in foreach
            }

            return true;
        });

        if (activeModule) {
            return Promise.resolve(activeModule.process(ctx));
        }
        
        return Promise.resolve();
    }
});

module.exports = Controller();
