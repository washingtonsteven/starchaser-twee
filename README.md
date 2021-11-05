# Ascendancy: Starchaser

A [Twee3](https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md) story about exploring a future galaxy.

[![Netlify Status](https://api.netlify.com/api/v1/badges/81c2b911-9857-44fa-b0e0-6eb0caa640a2/deploy-status)](https://app.netlify.com/sites/condescending-montalcini-218035/deploys)

## Build

1. Install [Tweego](https://www.motoslave.net/tweego/)
   1. Ensure `tweego` is available on your `PATH` (i.e. `which tweego` works)
2. `yarn install` 
3. `yarn build`

## Play

1. Build
2. `yarn serve` to play locally
3. Host `build/index.html` to play online

### Hosted Version

The latest version of the story _should_ be available on [Netlify](https://condescending-montalcini-218035.netlify.app/)

## Dev

1. Ensure [Tweego](https://www.motoslave.net/tweego/) is installed and on the `PATH`
2. `yarn watch` will:
   1. Run a build
   2. Serve the build at <http://localhost:1234>
   3. Re-run the build whenever a `.twee`, `.js`, or `.scss` file is changed.

## Info

- Check out the [build script](./bin/build.sh) to see the process that builds your story.
  - When this is built on Netlify, the build script fetches and builds Tweego from source, which feels a bit janky but it works at least.
  - In theory the repo can hold a copy a tweego, for Netlify's/CI's sake. For local dev you're on your own (since the executable will be different between Mac, Linux, and Windows)
    - To be fair, the build script will not work on Windows (unless you're in WSL). So don't do that.
- This story is built using [Tweego](https://www.motoslave.net/tweego/). In order to build you must install this separately.
- JS and CSS (Sass) are built with [webpack](https://webpack.js.org/)
  - `js/main.ts` is the entry point for page Javascript
    - It's TypeScript! Isn't that nat. [SugarCube has types too](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/twine-sugarcube)
    - Since Tweego will include the JS as if it is Story Javascript (and not just page JS), we don't need a separate `[script]` passage.
  - `scss/style.scss` is the main Sass file
    - Since CSS isn't dependent on anything in SugarCube's scope, `[stylesheet]` passages _shouldn't_ be necessary.
  - Built JS/CSS is placed in `./src/dist`, which `tweego` will include as if they are in `[script]` and `[stylesheet]` passages
    - Basically, you'll have access to SugarCube's APIs, like `Config` and `State`.
- The story uses the included SugarCube 2.35.0 format in `.storyformats/sugarcube-2.35.0`
