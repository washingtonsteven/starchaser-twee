const speech = require("./speech");
const cont = require("./continue");
const preload = require("./preload");

module.exports = function(setup) {
    speech(setup);
    cont(setup);
    preload(setup);
}