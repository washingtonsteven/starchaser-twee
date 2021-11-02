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

const readFilesInDir = (dirPath) => {
  const files = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((f) => f.isFile())
    .map((fileDirent) => path.resolve(dirPath, fileDirent.name));
  let contents = "";
  files.forEach((file) => {
    const fileContents = fs.readFileSync(file);
    contents += `\n\n${fileContents}`;
  });

  return contents;
};

const getStoryWordCount = (story) => {
  const passages = story.passages.filter((p) => {
    if (
      [
        "StoryTitle",
        "StoryData",
        "PassageFooter",
        "PassageHeader",
        "StoryCaption",
        "StoryInit",
      ].includes(p.name)
    ) {
      return false;
    }

    if (
      p.tags.includes("stylesheet") ||
      p.tags.includes("script") ||
      p.tags.includes("widget")
    ) {
      return false;
    }
    return true;
  });
  const corePassageContent = passages.reduce((acc, curr) => {
    return (acc += curr.text);
  }, "");
  return corePassageContent.split(/\s+/).length;
}

directories.forEach((directory) => {
  const dirPath = path.resolve(__dirname, "stories", directory.name);
  console.log(`Building from ${dirPath}...`);

  const dirs = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((dirDirent) => path.resolve(dirPath, dirDirent.name));
  let contents = "";

  contents += readFilesInDir(dirPath);
  dirs.forEach((subdirPath) => (contents += readFilesInDir(subdirPath)));

  if (contents) {
    const tweeParser = new Extwee.TweeParser(contents);
    console.log(`\tFound story: ${tweeParser.story.name}`);
    const formatName = tweeParser.story.metadata.format || DEFAULT_FORMAT;
    const formatVersion =
      tweeParser.story.metadata.formatVersion ||
      tweeParser.story.metadata["format-version"] ||
      DEFAULT_FORMAT_VERSION;
    const formatParser = new Extwee.StoryFormatParser(
      getFormatPath(formatName, formatVersion)
    );
    // Replace macro brackets with html entities for sugarcube
    if (formatName === "sugarcube") {
      tweeParser.story.passages.forEach((passage) => {
        passage.text = passage.text
          .replace(/<</g, "&lt;&lt;")
          .replace(/>>/g, "&gt;&gt;");
      });
    }
    new Extwee.HTMLWriter(
      path.resolve(__dirname, `build/${directory.name}.html`),
      tweeParser.story,
      formatParser.storyformat
    );
    console.log(`\tWord Count: ${getStoryWordCount(tweeParser.story)}`);
  }
  console.log(`...Done!\n---\n`);
});
