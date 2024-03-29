class Manager {
    constructor(container) {
        this.container = container;
        this._trie = new Trie();
        this._styles = {
            "brands": "fab",
            "solid": "fas",
            "light": "fal",
            "regular": "far"
        };
    }

    get trie() {
        return this._trie;
    }

    // Private Methods
    #_createIconNode(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "image/svg+xml");
        return doc.firstChild;
    }

    #_loadIcons(icons, selectedCallback, parentElement, trie) {
        var iconCount = 0;
        var nodeCount = 0;
        var t0 = performance.now();
        var containerElement = parentElement.getElementsByClassName('result')[0];

        for (var key in icons) {
            iconCount++;
            var icon = icons[key];
            var rawHtml = icon.svg[icon.styles[0]].raw;
            var iconElement = this.#_createIconNode(rawHtml);

            // set the icon data class 
            iconElement.setAttribute("data-class", this._styles[icon.styles[0]] + " fa-" + key);

            iconElement.addEventListener('click', (e) => {
                var iconClass = '';
                if (e.target.nodeName === 'path') {
                    iconClass = e.target.parentNode.getAttribute("data-class");
                }
                else {
                    iconClass = e.target.getAttribute("data-class");
                }

                selectedCallback(iconClass);
                console.log("Icon selected: " + iconClass);
            });

            containerElement.appendChild(iconElement);
            if (!icon.search.terms.indexOf(key) > -1) {
                icon.search.terms.push(key);
            }
            nodeCount += icon.search.terms.length;
            trie.addWords(icon.search.terms, iconElement);
        }

        var t1 = performance.now();
        console.log("Loading " + iconCount + " icons with " + nodeCount + " nodes finished in " + (t1 - t0) + "ms");
    }

    // Public Methods
    dumpTrie() {
        console.log(JSON.stringify(this.trie.root, this.trie.replacer));
    }

    handleKeyUp(e) {
        var key = e.key.toLowerCase();

        // Enter, delete or backspace we need to do a full filter of the trie
        if (key === "enter" || key === "delete" || key === "backspace") {
            this.trie.filter(e.target.value);
        }
        else {

            if (key.length === 1) {
                this.trie.refine(key);
            }
        }
    }

    setup(selectedCallback, url) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var json = JSON.parse(xmlhttp.responseText);
                this.#_loadIcons(json, selectedCallback, this.container, this.trie);
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
}