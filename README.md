# joyride-twee

A [Twee3]() story about exploring a future galaxy.

## Build

This is built using [extwee](https://github.com/videlais/extwee) and [Harlowe 3.2.2](https://twine2.neocities.org/), though likely any Twee3 compatible compiler would work. Here's what I did:

1. Download [extwee](https://github.com/videlais/extwee)
   1. On MacOS I had to `chmod +x` the file, and also run it once (`extwee-macos --help`) in order to trigger it to be blocked my Mac security, then allowed it in the Security Prefpane in System Preferences.
2. Download the [Harlowe](https://foss.heptapod.net/games/harlowe/-/tree/v3.2.2) Repository
   1. Click the download icon on the repo to download a zip, also select a branch/tag (the link above should take you to `v3.2.2` directly)
   2. Or you can get the repo with Mercurial I think? I don't know Mercurial so that's a non-starter for me.
3. `cd` into the Harlowe repository:
   1. `npm install`
   2. `gem install sass`
      1. If you didn't already have `sass` installed. Yes, this version is deprecated but that's what Harlowe needs.
         1. It seems like it just invokes the `sass` executable, so [Dart Sass](https://sass-lang.com/install) _might_ work.
   3. `make format`
      1. If there is a sass compilation problem, you may have to rename `scss/_flex.scss` to `scss/a_flex.scss`. This happened to me while trying to compile on WSL (Windows Subsystem for Linux), but worked fine on MacOS
4. Run `extwee-[OS] -r story -o build/index.html -f <path to Harlowe repo>/dist/format.js` to build the story
   1. `extwee` doesn't support `StoryIncludes` (they aren't actually part of the Twee3 spec anyway), but reading the directory should be just fine.
5. Bonus: Update/add a task to `.vscode/tasks.json` if you want to run a file watcher as a VSCode build task (i.e. `Cmd/Ctrl-Shift-B` while developing).