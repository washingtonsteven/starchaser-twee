const webpack = require("webpack");
const config = require("./webpack.config");
const { exec } = require("child_process");
const path = require("path");

const runBuild = (executableOrPostFunction) => {
    webpack(config, (err, stats) => {
        if (err) {
            throw err;
        }
        if (stats.hasErrors()) {
            console.error(JSON.stringify(stats.toJson().errors, null, 1));
            return;
        }

        if (
            executableOrPostFunction &&
            typeof executableOrPostFunction === "function"
        ) {
            executableOrPostFunction();
            return;
        } else if (
            executableOrPostFunction &&
            typeof executableOrPostFunction === "string"
        ) {
            const tweegoCommand = `${executableOrPostFunction} -o ${__dirname}/build/index.html --log-stats ${__dirname}/src`;
            console.log(tweegoCommand);
            exec(tweegoCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(
                        `Error running \`tweego\`: ${error.message}`,
                        stderr
                    );
                } else if (stderr) {
                    console.error(`stderr (\`tweego\`): ${stderr}`);
                } else {
                    console.log(`stdout (\`tweego\`): ${stdout}`);
                }
                console.log("...done.");
            });
        } else {
            console.error(
                "executableOrPostFunction is not function or string: ",
                typeof executableOrPostFunction
            );
        }
    });
};

// If we are building on Netlify, we need to fetch/build the tweego executable
if (process.env.NETLIFY) {
    exec(
        `${path.resolve(__dirname, "bin", "get-tweego")}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error("Error getting tweego", error, stderr);
                return;
            }
            if (stderr) {
                console.log("stderr getting tweego", stderr);
            }
            if (stdout) {
                console.log("stdout getting tweego", stdout);
            }

            runBuild(() => {
                exec(
                    `mkdir build && $(go env GOPATH)/bin/tweego -o ./build/index.html --log-stats --log-files ./src`,
                    { cwd: path.resolve(__dirname) },
                    (error, stdout, stderr) => {
                        if (error) {
                            console.error(
                                "Error running tweego",
                                error,
                                stderr
                            );
                            return;
                        }
                        if (stderr) {
                            console.log("stderr running tweego", stderr);
                        }
                        if (stdout) {
                            console.log("stdout running tweego", stdout);
                        }
                    }
                );
            });
        }
    );
// local build, need to have installed tweego separately
} else {
    exec("which tweego", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running \`which tweego\`: ${error.message}`);
            console.error(
                "Did you remember to install Tweego? (https://www.motoslave.net/tweego/)"
            );
            return;
        }
        if (stderr) {
            console.error(`stderr (\`which tweego\`): ${stderr}`);
            return;
        }

        runBuild("tweego");
    });
}
