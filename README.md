# Ascendancy: Starchaser

A [Twee3](https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md) story about exploring a future galaxy.

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

- Check out the [build script](build.js) to see the process that builds your story.
  - When this is built on Netlify, the build script fetches and builds Tweego from source, which feels a bit janky but it works at least.
- This story is built using [Tweego](https://www.motoslave.net/tweego/). In order to build you must install this separately.
- JS and CSS (Sass) are built with [webpack](https://webpack.js.org/)
  - `js/main.js` is for Javascript that is run globally, and not dependent on story state.
    - This is the place to load 3rd party libraries, etc.
  - In order to access SugarCube's APIs, that JS must be in a `[script]` tagged passage.
    - These passages are in `story/js`
  - `scss/style.scss` is the main Sass file
    - Since CSS isn't dependent on anything in SugarCube's scope, `[stylesheet]` passages _shouldn't_ be necessary.
  - Built JS/CSS is placed in `./dist`, separate from `./build` since `tweego`'s `-m` option doesn't like being the same folder as the output folder.
- The story uses the included SugarCube 2.35.0 format in `.storyformats/sugarcube-2.35.0`
