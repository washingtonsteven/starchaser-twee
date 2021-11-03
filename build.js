const webpack = require("webpack");
const config = require("./webpack.config");
const { exec } = require("child_process");
const path = require("path");

const runBuild = (tweegoExecutable) => {
    webpack(config, (err, stats) => {
        if (err) {
            throw err;
        }
        if (stats.hasErrors()) {
            console.error(JSON.stringify(stats.toJson().errors, null, 1));
            return;
        }

        const tweegoCommand = `${tweegoExecutable} -o ${__dirname}/build/index.html -m ${__dirname}/dist --log-stats ${__dirname}/story`
        console.log(tweegoCommand)
        exec(tweegoCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running \`tweego\`: ${error.message}`);
            } else if (stderr) {
                console.error(`stderr (\`tweego\`): ${stderr}`);
            } else {
                console.log(`stdout (\`tweego\`): ${stdout}`);
            }
            console.log("...done.");
        });
    });
}

if (process.env.NETLIFY) {
    exec(`${path.resolve(__dirname, "bin", "get-tweego")}`, (error, stdout, stderr) => {
        if (error) {
            console.error("Error getting tweego", error);
            return;
        }
        if (stderr) {
            console.log("stderr", stderr);
        }
        if (stdout) {
            console.log("stdout", stdout);
        }
        runBuild(path.resolve(__dirname, "tweego", "tweego"));
    })
} else {
    exec("which tweego", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running \`which tweego\`: ${error.message}`);
            console.error("Did you remember to install Tweego? (https://www.motoslave.net/tweego/)");
            return;
        }
        if (stderr) {
            console.error(`stderr (\`which tweego\`): ${stderr}`);
            return;
        }
    
        runBuild("tweego");
    });
}