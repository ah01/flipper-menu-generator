const debug = require("debug")("index");
const fs = require("fs");
const path = require("path");
const minimist = require('minimist');

const Parser = require("../libs/parser");
const generator = require("../libs/generator").generator;
const graphviz = require("../libs/graphviz");

// ---

const args = minimist(process.argv.slice(2), {
    boolean: ["help", "single"],
    alias: {
        "h": "help",
        "s": "single"
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

// ---

const sourceFile = args._[0];
const basePath = path.dirname(sourceFile)
const baseName = path.basename(sourceFile, ".md");
const md =  fs.readFileSync(sourceFile).toString();

console.log(`Source file: ${sourceFile}`);
debug(`File base name: ${baseName}`);

(async () => {

if (args.single)
{
    debug("Process single menu file");
    let structure = Parser.parseMenu(md);
    throw "Not implemented";
}
else
{
    debug("Process multiple menu file");
    let doc = Parser.parseDocument(md);

    let counter = 1;
    for(let i = 0; i <  doc.blocks.length; i++)
    {
        if (!doc.blocks[i].isMenu)
            continue;
        let s = doc.blocks[i];
        let name = s.header || counter ++;
        let fileName = baseName + "." + getFileName(name);
        let dot = generator(s.structure);
        debug(`Processing menu: ${name} (${fileName})`);

        fs.writeFileSync(basePath + "/" + fileName + ".gv", dot);

        await graphviz.generatePng(dot, basePath + "/" + fileName + ".png");

        if (i > 0)
        {
            var imgTag = `![${name}](${fileName + ".png"})`;
            debug(imgTag);
            if (!doc.blocks[i-1].text.includes(imgTag))
            {
                doc.blocks[i-1].text += "\n\n" + imgTag;
            }
        }
    }

    var docMd = doc.blocks.map(b => b.text).join("\n");
    fs.writeFileSync(basePath + "/" + baseName + ".out.md", docMd);
}


})().catch(e => {
    console.error(e);
});

function getFileName(name)
{
    name = name.toLowerCase().replace(/\s+/, "-");
    name = name.replace(/[^a-z0-9-]/, "");
    return name;
}
