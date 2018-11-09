function Manager(container) {

    this.container = container;
    this.trie = new Trie();
}

Manager.prototype = (function () {
    'use strict';

    // Instance Constants
    const _styles = {
        "brands": "fab",
        "solid": "fas",
        "light": "fal",
        "regular": "far"
    };

    // Private Methods
    function _createIconNode(html) {
        var template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function _loadIcons(icons, selectedCallback, parentElement, trie) {
        var iconCount = 0;
        var nodeCount = 0;
        var t0 = performance.now();
        var containerElement = parentElement.getElementsByClassName('result')[0];

        for (var key in icons) {
            iconCount++;
            var icon = icons[key];
            var html = icon.svg[icon.styles[0]].raw;
            var iconElement = _createIconNode(html);
            // set the icon data class 
            iconElement.dataset.class = _styles[icon.styles[0]] + " fa-" + key;

            iconElement.addEventListener('click', (e) => {
                if (e.srcElement.nodeName === 'path') {
                    selectedCallback(e.srcElement.parentElement.dataset.class);
                }
                else {
                    selectedCallback(e.srcElement.dataset.class);
                }
            });

            containerElement.appendChild(iconElement);
            if (!icon.search.terms.includes(key)) {
                icon.search.terms.push(key);
            }
            nodeCount += icon.search.terms.length;
            trie.addWords(icon.search.terms, iconElement);
        }

        var t1 = performance.now();
        console.log("Loading " + iconCount + " icons with " + nodeCount + " nodes finished in " + (t1 - t0) + "ms");
    }

    // Public Methods
    function dumpTrie() {
        console.log(JSON.stringify(this.trie.root, this.trie.replacer));
    }

    function handleKeyUp(e) {
        var key = e.key.toLowerCase();

        // Enter or delete
        if (key === "enter" || key === "delete") {
            this.trie.filter(e.target.value);
        }
        else {
            
            var isLetter = (key >= "a" && key <= "z") && key.length === 1;
            var isNumber = (key >= "0" && key <= "9") && key.length === 1;
            var isBackspace = key === "backspace";

            if (isBackspace || isNumber || isLetter) {
                this.trie.refine(key);
            }
        }
    }

    function setup(selectedCallback) {
        loader.load('/App_Plugins/FontAwesomeIconFinder/icons.json')
            .then((response) => {
                _loadIcons(response, selectedCallback, this.container, this.trie);
            }).catch((error) => {
                console.error(error);
            });
    }

    return {
        setup: setup,
        handleKeyUp: handleKeyUp,
        dumpTrie: dumpTrie
    };
})();