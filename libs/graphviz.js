const fs = require('fs');
const child = require('child_process');

const dot = "c:/Program Files (x86)/Graphviz2.38/bin/dot.exe";

function _spawnAsync(path, args, stdinData)
{
    return new Promise((resolve, reject) => {
        let p = child.spawn(path, args);
        
        // redirect stdout and stderr to console
        // TODO this has to be changed for non-CLI usage (e.g. webapp)
        p.stdout.pipe(process.stdout, { end: false });
        p.stderr.pipe(process.stderr, { end: false });
        
        p.on("exit", resultCode => {
            if (resultCode == 0)
                resolve();
            else
                reject(resultCode);
        });

        p.on("error", error => {
            console.log(error);
            reject(error);
        })

        if (stdinData)
        p.stdin.write(stdinData, () => p.stdin.end());
        // TODO handle error states correctly
    });
}

async function generatePng(content, filePath)
{
    return await _spawnAsync(dot, ["-Tpng", "-o", filePath], content);
}

module.exports.generatePng = generatePng;