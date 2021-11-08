module.exports = function(setup) {
    require("./speech")(setup);
    require("./continue")(setup)
    require("./preload")(setup)
    require("./events")(setup)
}