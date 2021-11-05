#!/bin/bash
set -e

TWEEGO_TAG="v2.1.1"; # Get this specific release from git
TWEEGO_ARGS="-o ./build/index.html --log-stats --log-files ./src"

echo "Running webpack..."
yarn webpack
echo "...Webpack done."

if [ $NETLIFY = "true" ] # env variable. See: https://docs.netlify.com/configure-builds/environment-variables/
then
    echo "Netlify build, fetching tweego"
    if [ ! -d tweego ]
    then
        git clone --depth 1 --branch $TWEEGO_TAG -c advice.detachedHead=false https://github.com/tmedwards/tweego.git
    fi
    cd tweego
    go get
    go install
    cd -
    if [ ! -d build ]
    then
        mkdir build
    fi
    echo "running tweego: \"$(go env GOPATH)/bin/tweego $TWEEGO_ARGS\""
    $(go env GOPATH)/bin/tweego $TWEEGO_ARGS
else
    echo "Local build, not fetching tweego"
    echo "running tweego \"tweego $TWEEGO_ARGS\""
    if [ ! -d build ]
    then
        mkdir build
    fi
    tweego $TWEEGO_ARGS
fi

echo "...Tweego done."
