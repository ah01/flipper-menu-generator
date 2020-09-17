const Parser = require("./parser");
const graphviz = require("./graphviz");

function generator(data)
{
    var dot = `
    digraph g {
        graph [
            rankdir = "LR"
            style="filled"
            pad="0.5", 
            nodesep="0.5", 
            ranksep="1.5"
        ];
        node [
            fontsize = "11"
            fontname = Helvetica
            shape = plaintext
        ];
        edge [
        ];\n`;

    for(let m of data.menus)
        dot += generateMenuNode(m);

    for(let e of data.edges)
        dot += generateMenuEdge(e);

    dot += `\n}`;

    return dot;
}

function generateMenuNode(menu)
{
    let dot = "";
    dot += `"${menu.id}" [\n`;
    dot += `  label = <\n`;
    dot += `    <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="orange" CELLPADDING="3" PORT="t">\n`;
    if (menu.showHeader) {
        dot += `      <TR><TD PORT="h" BGCOLOR="black" WIDTH="180"><FONT COLOR="orange">${menu.header}</FONT></TD></TR>\n`;
    }
    for (let i of menu.items) {
        dot += `      <TR><TD WIDTH="180" PORT="${i.n}" ALIGN="left">• ${i.title}</TD></TR>\n`;
    }
    dot += `    </TABLE>\n`;
    dot += `  >\n`;
    dot += `];\n\n`;
    return dot;
}

function generateMenuEdge(edge)
{
    return `${edge.from.menu.id}:${edge.from.n} -> ${edge.to.id}:${edge.to.showHeader ? 'h' : '0'};\n`;
}

class MenuGenerator
{
    load(markdown) 
    {
        let parser = new Parser();
        this.data = parser.parse(markdown);
        return this.data;
    }

    async generatePng(path)
    {
        let content = this.generateDot();
        await graphviz.generatePng(content, path);
    }

    generateDot()
    {
        return generator(this.data);
    }
}

module.exports = MenuGenerator;
