const Extwee = require("extwee");
const path = require("path");

const file = new Extwee.FileReader(
  path.resolve(__dirname, "story/_index.twee")
);
const tweeParser = new Extwee.TweeParser(file.contents);
const HarloweFormatParser = new Extwee.StoryFormatParser(
  path.resolve(__dirname, "formats/harlowe-v3.2.2.js")
);

const htmlWriter = new Extwee.HTMLWriter(
  path.resolve(__dirname, "build/index.html"),
  tweeParser.story,
  HarloweFormatParser.storyformat
);
