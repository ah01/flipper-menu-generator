const debug = require("debug")("parser");
const markmap = require('markmap-lib/dist/transform');

class Parser
{
    parse(markdown)
    {
        let data = markmap.transform(markdown);

        let menuId = 0;
        let menus = [];
        let edges = [];

        let root = processItem(data);

        return {
            root: root,
            menus: menus,
            edges: edges
        };

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
                    edges.push(e);
                }
            }
            menus.push(menu);
            return menu;
        }
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

module.exports = Parser;
