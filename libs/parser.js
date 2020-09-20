const debug = require("debug")("parser");
const markmap = require('markmap-lib/dist/transform');

const menuSectionStart = "<!--- menu structure -->";
const menuSectionEnd = "<!--- menu structure end -->";

function findLastHeaderBeforeLine(lines, line)
{
    do{
        var l = lines[line--];
        if (l.startsWith("#"))
            return l.replace(/^#+(\s*)/, "").trim();
    } while (line > 0)
}

class Parser
{
    static parseDocument(markdown)
    {
        let lines = markdown.split("\n");
        let doc = new Document();
        
        let isMenuSection = false;
        let last = "";
        let lastHeader = "";

        for(let i = 0; i < lines.length; i++)
        {
            var line = lines[i] + "\n";
            var ll = lines[i].trim().toLowerCase();

            if (ll === menuSectionStart)
            {
                doc.blocks.push({isMenu: false, text: last});
                isMenuSection = true;
                lastHeader = findLastHeaderBeforeLine(lines, i);
                last = line;
                continue;
            }
            else if (ll === menuSectionEnd)
            {
                last += line + "\n";
                isMenuSection = false;
                doc.blocks.push({isMenu: true, header: lastHeader, text: last});
                last = "";
                continue;
            }

            last += line;
        }

        doc.blocks.push({isMenu: isMenuSection, text: last});

        for (let m of doc.blocks.filter(x => x.isMenu))
        {
            m.structure = Parser.parseMenu(m.text);
        }

        //console.log(doc);
        return doc;
    }

    static parseMenu(markdown)
    {
        let data = markmap.transform(markdown);
        let structure = new MenuStructure();
        let menuId = 0;

        structure.root = processItem(data);
        return structure;

        function processItem(item)
        {
            if (!item.c)
                return;

            let menu = new Menu(`m${(menuId++)}`, item.v, item.t == "heading");

            for (const c of item.c) {
                let i = menu.addItem(c.v);
                let submenu = processItem(c);
                if (submenu)
                {
                    i.submenu = submenu;
                    let e = new Edge(i, submenu);
                    structure.edges.push(e);
                }
            }
            structure.menus.push(menu);
            return menu;
        }
    }
}

class MenuStructure
{
    constructor()
    {
        this.root = null;
        this.menus = [];
        this.edges = [];
    }
}

class Menu
{
    constructor(id, header, showHeader)
    {
        this.id = id;
        this.header = header;
        this.showHeader = showHeader;
        this.items = [];
    }

    addItem(title)
    {
        let item = new Item(this, title, this.items.length);
        this.items.push(item);
        return item;
    }
}

class Item
{
    constructor(menu, title, n)
    {
        this.menu = menu;
        this.title = title;
        this.n = n;
        this.submenu = null;
    }
}

class Edge
{
    constructor (fromItem, toMenu)
    {
        this.from = fromItem;
        this.to = toMenu;
    }
}

/**
 * Represent MD document with multiple menus
 */
class Document
{
    constructor()
    {
        this.blocks = [];
    }
}

module.exports = Parser;
