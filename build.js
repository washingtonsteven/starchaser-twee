const Extwee = require("extwee");
const path = require("path");
const fs = require("fs");

const DEFAULT_FORMAT = "harlowe";
const DEFAULT_FORMAT_VERSION = "3.2.2";

const getFormatPath = (formatName, formatVersion) => {
  const formatPath = path.resolve(
    __dirname,
    "formats",
    `${formatName.toLowerCase()}-v${formatVersion}.js`
  );

  if (!fs.existsSync(formatPath)) {
    throw new Error(
      `Unable to load story format: ${formatName.toLowerCase()}-v${formatVersion}.js`
    );
  }

  return formatPath;
};

const directories = fs
  .readdirSync(path.resolve(__dirname, "stories"), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory());

directories.forEach((directory) => {
  const dirPath = path.resolve(__dirname, "stories", directory.name);
  const files = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((f) => f.isFile())
    .map((fileDirent) => path.resolve(dirPath, fileDirent.name));
  let contents = "";
  files.forEach((file) => {
    const fileContents = fs.readFileSync(file);
    contents += `\n\n${fileContents}`;
  });

  if (contents) {
    const tweeParser = new Extwee.TweeParser(contents);
    const formatName = tweeParser.story.metadata.format || DEFAULT_FORMAT;
    const formatVersion =
      tweeParser.story.metadata.formatVersion ||
      tweeParser.story.metadata["format-version"] ||
      DEFAULT_FORMAT_VERSION;
    const formatParser = new Extwee.StoryFormatParser(
      getFormatPath(formatName, formatVersion)
    );
    new Extwee.HTMLWriter(
      path.resolve(__dirname, `build/${directory.name}.html`),
      tweeParser.story,
      formatParser.storyformat
    );
  }
});
