class Trie {
    constructor() {
        this._root = new FaifNode();
        this.currentNode = null;
    }

    get root() {
        return this._root;
    }

    // Prive methods
    #_hide(node) {
        for (var index in node.icons) {
            var icon = node.icons[index];

            // Remove this node from the icon's list of active nodes
            icon.activeNodes = icon.activeNodes.filter((element) => {
                return element !== node;
            });

            // Only hide the node if there's no more active icons
            if (!icon.activeNodes.length) {
                if (!icon.classList.contains('hidden')) {
                    icon.classList.add('hidden');
                }
            }
        }
    };

    #_show(node) {
        for (var index in node.icons) {
            var icon = node.icons[index];

            // Add this node to this icons list of active nodes
            icon.activeNodes.push(node);
            node.icons[index].classList.remove('hidden');
        }
    };

    addWords(words, icon) {
        icon.activeNodes = [];

        for (var index in words) {
            this.root.addWord(words[index].toLowerCase(), icon);
        }
    }

    toString() {
        this.root.toString("");
    }

    refine(key) {
        var t0 = performance.now();
        var nextNode = (this.currentNode || this.root).children[key];

        if (nextNode) {
            // We've found a valid child node
            this.currentNode = nextNode;
            if (key === 'backspace') {
                // show all the children
                this.currentNode.findLeaves(this.#_show);
            }
            else {
                // hide all the siblings
                this.currentNode.parent.findLeaves(this.#_hide, this.currentNode.text);
            }
        }
        else {
            // no valid child node found so just hide everything
            this.currentNode.findLeaves(this.#_hide);
        }

        var t1 = performance.now();
        console.log("Refining finished in " + (t1 - t0) + "ms");
    }

    filter(word) {
        var t0 = performance.now();
        word = word.toLowerCase();
        // Hide every thing and filter it later
        this.root.findLeaves(this.#_hide);

        if (!word) {
            // Reset the current not
            this.currentNode = null;
            this.root.findLeaves(this.#_show);
        }
        else {
            this.root.filter(word, this.#_show);
        }

        var t1 = performance.now();
        console.log("Filtering finished in " + (t1 - t0) + "ms");
    }

    // This method is used to help json strinify break the
    // circular references caused by the parent child replationships
    // Useage: JSON.stringify(trie.root, trie.replacer)
    replacer(key, value) {

        if (key === 'text') {
            return {
                name: value
            };
        }

        if (key === 'children') {
            var arr = [];
            for (var k in value) {
                arr.push(value[k]);
            }
            return arr;
        }

        if (key !== 'parent' && key !== 'icons') {
            return value;
        }
    }
}