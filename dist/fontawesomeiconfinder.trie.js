"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Trie() {}

Trie.prototype = function () {
  'use strict'; // Node Object methods

  var Node = function Node(text) {
    var _this = this;

    _classCallCheck(this, Node);

    this.text = text;
    this.children = {};
    this.parent = null;
    this.icons = [];
    this.addWord = _nodeAddWord;
    this.filter = _nodeFilter;
    this.printPath = _nodePrintPath;
    this.findLeaves = _nodeFindLeaves;
    this.toString = _nodeToString;

    this.isRoot = function () {
      return _this.parent === null;
    };
  }; // Instance varaibles


  var root = new Node();
  var currentNode = null; // Prive methods

  function _nodeToString(prefix) {
    console.log(prefix + (this.text || 'root'));

    for (var index in this.children) {
      prefix += "-";
      this.children[index].toString(prefix);
    }
  }

  function _hide(node) {
    for (var index in node.icons) {
      var icon = node.icons[index]; // Remove this node from the icon's list of active nodes

      icon.activeNodes = icon.activeNodes.filter(function (element) {
        return element !== node;
      }); // Only hide the node if there's no more active icons

      if (!icon.activeNodes.length) {
        if (!icon.classList.contains('hidden')) {
          icon.classList.add('hidden');
        }
      }
    }
  }

  ;

  function _show(node) {
    for (var index in node.icons) {
      var icon = node.icons[index]; // Add this node to this icons list of active nodes

      icon.activeNodes.push(node);
      node.icons[index].classList.remove('hidden');
    }
  }

  ;

  function _nodeFindLeaves(func, foundKey) {
    if (this.icons.length > 0) {
      // this is a valid path even if it doesn't end in a leaf
      func(this); // This is a debugging line. It will impact performance heavily. Dont use in production
      //this.printPath();
    }

    if (this.children) {
      for (var index in this.children) {
        if (foundKey && index !== foundKey || !foundKey) {
          this.children[index].findLeaves(func);
        }
      }
    }
  }

  function _nodePrintPath(path) {
    var currentPath = "";

    if (!this.isRoot()) {
      currentPath = this.text + currentPath;
    }

    if (path) {
      currentPath = currentPath + path;
    }

    if (this.parent) {
      this.parent.printPath(currentPath);
    } else {
      console.log(currentPath);
    }
  }

  function _nodeFilter(word) {
    if (word[0] === this.text || this.isRoot()) {
      if (word.length === 1 && !this.isRoot()) {
        this.findLeaves(_show);
      } else {
        if (this.children) {
          for (var index in this.children) {
            var newWord = this.isRoot() ? word : word.substring(1);
            this.children[index].filter(newWord);
          }
        } else {
          this.findLeaves(_show);
        }
      }
    }
  }

  function _nodeAddWord(word, icon) {
    if (!word) {
      icon.activeNodes.push(this);
      this.icons.push(icon);
      return;
    }

    var nextChild = this.children ? this.children[word[0]] : null; // we've found the next child 

    if (nextChild) {
      nextChild.addWord(word.substring(1), icon);
    } else {
      var newChild = new Node(word[0]);
      newChild.parent = this;

      if (!this.children) {
        this.children = {};
      }

      this.children[word[0]] = newChild;
      newChild.addWord(word.substring(1), icon);
    }
  } // Public Methods


  function addWords(words, icon) {
    icon.activeNodes = [];

    for (var index in words) {
      root.addWord(words[index].toLowerCase(), icon);
    }
  }

  function toString() {
    this.root.toString("");
  }

  function refine(key) {
    var t0 = performance.now();
    var nextNode = (this.currentNode || this.root).children[key];

    if (nextNode) {
      // We've found a valid child node
      this.currentNode = nextNode;

      if (key === 'backspace') {
        // show all the children
        this.currentNode.findLeaves(_show);
      } else {
        // hide all the siblings
        this.currentNode.parent.findLeaves(_hide, this.currentNode.text);
      }
    } else {
      // no valid child node found so just hide everything
      this.currentNode.findLeaves(_hide);
    }

    var t1 = performance.now();
    console.log("Refining finished in " + (t1 - t0) + "ms");
  }

  function filter(word) {
    var t0 = performance.now();
    word = word.toLowerCase(); // Hide every thing and filter it later

    this.root.findLeaves(_hide);

    if (!word) {
      // Reset the current not
      this.currentNode = null;
      this.root.findLeaves(_show);
    } else {
      this.root.filter(word);
    }

    var t1 = performance.now();
    console.log("Filtering finished in " + (t1 - t0) + "ms");
  } // This method is used to help json strinify break the
  // circular references caused by the parent child replationships
  // Useage: JSON.stringify(trie.root, trie.replacer)


  function replacer(key, value) {
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

  return {
    filter: filter,
    addWords: addWords,
    toString: toString,
    root: root,
    currentNode: currentNode,
    replacer: replacer,
    refine: refine
  };
}();