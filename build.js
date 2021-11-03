const webpack = require("webpack");
const config = require("./webpack.config");
const { exec } = require("child_process");

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

    webpack(config, (err, stats) => {
        if (err) {
            throw err;
        }
        if (stats.hasErrors()) {
            console.error(JSON.stringify(stats.toJson().errors, null, 1));
            return;
        }

        const tweegoCommand = `tweego -o ${__dirname}/build/index.html -m ${__dirname}/dist --log-stats ${__dirname}/story`
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
});