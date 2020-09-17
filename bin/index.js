const fs = require("fs");
const minimist = require('minimist');

const MenuGenerator = require("../libs/generator");

// ---

const args = minimist(process.argv.slice(2), {
    boolean: ["help"],
    alias: {
        "h": "help",
    }
});

if (args.help) {
    console.log(fs.readFileSync(__dirname + "/help.txt").toString().trim());
    return;
}

if (args._.length != 1) {
    console.error("No file.");
    return;
}

const sourceFile = args._[0];
const targetFile = sourceFile + ".png";

console.log(`Source file: ${sourceFile}`);
console.log(`Target file: ${targetFile}`);

const gen = new MenuGenerator();

var md = fs.readFileSync(sourceFile).toString();
gen.load(md);

let dot = gen.generateDot();
fs.writeFileSync(sourceFile + ".dot", dot);

(async () => {
    var result = await gen.generatePng(targetFile);
    console.log(result);
})().catch(e => {
    console.error(e);
});


