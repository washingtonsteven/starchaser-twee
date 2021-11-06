const speech = require("./speech");
const cont = require("./continue");

module.exports = function(setup) {
    speech(setup);
    cont(setup);
}