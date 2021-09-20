# joyride-twee

A [Twee3](https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md) story about exploring a future galaxy.

## Play

The story is broken up into chapters, each of which is its own separate Twine game. You should probably start at Chapter 1.

### Online

_Online hosting coming soon_

### Locally

1. `yarn install`
2. `yarn serve`
3. Go to http://localhost:5000 (or whatever port the command said)
4. Navigate to the chapter that you want.

## Build

1. `yarn install` 
2. `yarn build` (TODO: add a `yarn clean` script)

## Info

- This is built using [extwee](https://github.com/videlais/extwee), specifically, the Node JS API and not the binary releases. So everything you need to generate the story should be installed with `yarn install` rather than having to download a binary for your system.
- Included are three formats: Harlowe 3.2.2, Snowman 2.0.3, and Sugarcube 2.35.0. I mainly have these here so I can play with them. More formats can be added to the `formats` folder using the `{lowercaseFormatName}-v{VersionString}.js` naming convention
- The stories/chapters are in the `stories` directory, and since each is a separate story, they can each use a different format. I don't know if that's something I'd want though.
- The main build script to compile all of the chapters is `build.js`.
- The Harlowe format is only really distributed with Twine itself. Here's how I got a copy up and running:
    1. Download the [Harlowe](https://foss.heptapod.net/games/harlowe/-/tree/v3.2.2) Repository
        1. Click the download icon on the repo to download a zip, also select a branch/tag (the link above should take you to `v3.2.2` directly)
        2. Or you can get the repo with Mercurial I think? I don't know Mercurial so that's a non-starter for me.
    2. `cd` into the Harlowe repository, and create `format.js`:
        1. `npm install`
        2. `gem install sass`
            1. If you didn't already have `sass` installed. Yes, this version is deprecated but that's what Harlowe needs.
                1. It seems like it just invokes the `sass` executable, so [Dart Sass](https://sass-lang.com/install) _might_ work.
    3. `make format`
        1. If there is a sass compilation problem, you may have to rename `scss/_flex.scss` to `scss/a_flex.scss`. This happened to me while trying to compile on WSL (Windows Subsystem for Linux), but worked fine on MacOS
    4. Copy that format into the `formats` folder in this repository, keeping the naming convention `{format name in lower case}-v{version string}.js`

### Debugging in Harlowe

Harlowe provides a debugger if you pass `options=debug` to the `tw-storydata` node in the built HTML. However `extwee` (and, it seems, the Twee3 spec) doesn't allow for passing options to the StoryData node. A manual way to activate the debugger is to edit the HTML directly. 

1. Open `build/{yourStory}.html`
2. Search for `tw-storydata`
3. Find the node opening tag (should be the second result)
   1. This _may_ also be on line 12, if you want to just hop there to check. I don't know if that will be the case for every build.
4. Change `options` (toward the end of the tag, just before `hidden`) to `options=debug`
   1. I guess if you're having trouble finding it you can search for `options hidden`, since this should be the only result.

Know that whenever you recompile (i.e. `yarn build` or perhaps a to-be-implemented watch command), you will have to re-edit the HTML. This is a pain, but I don't know a better way right now.