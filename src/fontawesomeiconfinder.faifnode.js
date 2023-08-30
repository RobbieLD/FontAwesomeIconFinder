// Node Object methods
class FaifNode {
    constructor(text) {
        this.text = text;
        this.children = {};
        this.parent = null;
        this.icons = [];
    }

    // Private Methods
    #_isRoot() {
        return this.parent === null;
    }

    // Public Methods
    toString(prefix) {
        console.log(prefix + (this.text || 'root'));

        for (var index in this.children) {
            prefix += "-";
            this.children[index].toString(prefix);
        }
    }

    findLeaves(func, foundKey) {

        if (this.icons.length > 0) {
            // this is a valid path even if it doesn't end in a leaf
            func(this);

            // This is a debugging line. It will impact performance heavily. Dont use in production
            //this.printPath();
        }

        if (this.children) {
            for (var index in this.children) {
                if ((foundKey && index !== foundKey) || !foundKey) {
                    this.children[index].findLeaves(func);
                }
            }
        }
    }

    printPath(path) {
        var currentPath = "";

        if (!this.#_isRoot()) {
            currentPath = this.text + currentPath;
        }

        if (path) {
            currentPath = currentPath + path;
        }

        if (this.parent) {
            this.parent.printPath(currentPath);
        }
        else {
            console.log(currentPath);
        }
    }

    filter(word, show) {
        if (word[0] === this.text || this.#_isRoot()) {
            if (word.length === 1 && !this.#_isRoot()) {
                this.findLeaves(show);
            } else {
                if (this.children) {
                    for (var index in this.children) {
                        var newWord = this.#_isRoot() ? word : word.substring(1);
                        this.children[index].filter(newWord, show);
                    }
                }
                else {
                    this.findLeaves(show);
                }
            }
        }
    }

    addWord(word, icon) {
        if (!word) {
            icon.activeNodes.push(this);
            this.icons.push(icon);
            return;
        }

        var nextChild = this.children ? this.children[word[0]] : null;

        // we've found the next child 
        if (nextChild) {
            nextChild.addWord(word.substring(1), icon);
        }
        else {
            var newChild = new FaifNode(word[0]);
            newChild.parent = this;

            if (!this.children) {
                this.children = {};
            }

            this.children[word[0]] = newChild;
            newChild.addWord(word.substring(1), icon);
        }
    }
}
