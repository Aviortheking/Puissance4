// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel/src/builtins/bundle-url.js"}],"style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel/src/builtins/css-loader.js"}],"../node_modules/@dzeio/dom-manager/dist/DOMElement.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DOMElement {
    constructor(tagName, options) {
        if (tagName instanceof HTMLElement) {
            this.item = tagName;
            return;
        }
        this.item = document.createElement(tagName, options);
    }
    static create(tagName, options) {
        return new DOMElement(tagName, options);
    }
    static get(query, source) {
        if (!(query instanceof HTMLElement)) {
            const tmp = (source instanceof DOMElement ? source.item : source || document).querySelector(query);
            if (!tmp) {
                return undefined;
            }
            return new DOMElement(tmp);
        }
        return new DOMElement(query);
    }
    on(type, listener, options) {
        this.item.addEventListener(type, listener, options);
        return this;
    }
    off(type, listener) {
        this.item.removeEventListener(type, listener);
        return this;
    }
    text(val) {
        if (val) {
            this.item.innerText = val;
            return this;
        }
        return this.item.innerText;
    }
    html(val) {
        if (val) {
            this.item.innerHTML = val;
            return this;
        }
        return this.item.innerText;
    }
    addClass(...classes) {
        this.item.classList.add(...classes);
        return this;
    }
    setClass(...classes) {
        this.item.classList.forEach((cls) => {
            if (!classes.includes(cls)) {
                this.item.classList.remove(cls);
            }
        });
        this.addClass(...classes);
        return this;
    }
    classList(...classes) {
        if (!classes) {
            const res = [];
            this.item.classList.forEach((el) => res.push(el));
            return res;
        }
        return this.setClass(...classes);
    }
    toggleClass(...classes) {
        for (const classe of classes) {
            this.item.classList.toggle(classe);
        }
        return this;
    }
    removeClass(...classes) {
        this.item.classList.remove(...classes);
        return this;
    }
    emit(event) {
        if (event in this.item) {
            this.item[event]();
            return this;
        }
        this.item.dispatchEvent(new Event(event));
        return this;
    }
    attr(key, value) {
        if (!value) {
            return this.item.getAttribute(key);
        }
        if (value === null) {
            this.item.removeAttribute(key);
            return this;
        }
        if (typeof value === 'boolean') {
            this.item[key] = value;
            return this;
        }
        this.item.setAttribute(key, value);
        return this;
    }
    data(key, value) {
        // @ts-ignore
        return this.attr(`data-${key}`, value);
    }
    style(key, value) {
        if (typeof value === 'undefined') {
            return this.item.style[key];
        }
        this.item.style[key] = value;
        return this;
    }
    exist() {
        return !!this.item;
    }
    placeBefore(item) {
        if (item instanceof DOMElement) {
            item = item.item;
        }
        const parent = item.parentElement;
        if (!parent) {
            throw new Error('can\'t place DOMElement before item because it has no parent');
        }
        parent.insertBefore(this.item, item);
        return this;
    }
    placeAsChildOf(item) {
        if (item instanceof DOMElement) {
            item = item.item;
        }
        item.appendChild(this.item);
        return this;
    }
    place(verb, item) {
        if (verb === 'before') {
            return this.placeBefore(item);
        }
        else {
            return this.placeAsChildOf(item);
        }
    }
}
exports.default = DOMElement;

},{}],"../node_modules/@dzeio/dom-manager/dist/DOMFleetManager.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class DOMFleetManager {
    constructor(query, source) {
        this.query = query;
        this.source = source;
        this.items = [];
        this.refresh();
    }
    last() {
        return this.items[this.items.length - 1];
    }
    each(fn) {
        this.items.forEach((el, index) => fn(el, index));
    }
    on(type, listener, options) {
        this.each((item) => item.on(type, listener, options));
    }
    off(type, listener) {
        this.each((item) => item.off(type, listener));
    }
    refresh() {
        this.items = [];
        (this.source instanceof _1.DOMElement ? this.source.item : this.source || document).querySelectorAll(this.query).forEach((item) => {
            const element = _1.DOMElement.get(item);
            if (!element) {
                return;
            }
            this.items.push(element);
        });
    }
    [Symbol.iterator]() {
        return this.items;
    }
}
exports.default = DOMFleetManager;

},{".":"../node_modules/@dzeio/dom-manager/dist/index.js"}],"../node_modules/@dzeio/dom-manager/dist/index.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMFleetManager = exports.DOMElement = void 0;
const DOMElement_1 = __importDefault(require("./DOMElement"));
exports.DOMElement = DOMElement_1.default;
const DOMFleetManager_1 = __importDefault(require("./DOMFleetManager"));
exports.DOMFleetManager = DOMFleetManager_1.default;

},{"./DOMElement":"../node_modules/@dzeio/dom-manager/dist/DOMElement.js","./DOMFleetManager":"../node_modules/@dzeio/dom-manager/dist/DOMFleetManager.js"}],"Game.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var dom_manager_1 = require("@dzeio/dom-manager");

var Game =
/** @class */
function () {
  function Game(table) {
    this.columns = [];
    this.rows = [];
    this.table = new dom_manager_1.DOMElement(table);
    this.setupGeneral();
  }

  Game.prototype.setupGeneral = function () {
    var _this = this; // Clear la table


    var rows = new dom_manager_1.DOMFleetManager('tr', this.table);
    rows.each(function (item, rowIndex) {
      var cells = new dom_manager_1.DOMFleetManager('td', item);

      _this.rows.push([]); // cellIndex = 0-6


      cells.each(function (cell, cellIndex) {
        _this.rows[rowIndex].push(cell);

        if (_this.columns.length <= cellIndex) {
          _this.columns.push([]);
        }

        _this.columns[cellIndex].push(cell);

        cell.text(' ').data('color', null); // Put each cells in the corresponding column
      });
      console.log(_this.columns);
    }); // Setup la base du jeux
  };

  Game.prototype.setupMultiplayer = function () {};

  Game.prototype.setupSinglePlayer = function () {};
  /**
   * Make a move and return and true if the move was done and false if the move was not done
   */


  Game.prototype.makeMove = function (xPos, color) {
    var cellToFill;

    for (var _i = 0, _a = this.columns[xPos]; _i < _a.length; _i++) {
      var cell = _a[_i];
      var color_1 = cell.data('color');

      if (!color_1) {
        cellToFill = cell;
      }

      if (color_1) {
        break;
      }
    }

    if (!cellToFill) {
      return false;
    }

    cellToFill.data('color', color);
    return true;
  };

  Game.prototype.checkWinner = function () {};

  Game.prototype.makeIATakeTurn = function () {
    var turnDone = false;

    while (!turnDone) {
      var pos = getRandomInt(0, this.columns.length - 1);
      turnDone = this.makeMove(pos, 'red');
    }
  };

  return Game;
}();

exports.default = Game;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
} // const cell = new DOMElement('tr')
// cell.data('color') // return 'red | 'yello' pour get
// cell.data('color', 'red') //return void pour set
},{"@dzeio/dom-manager":"../node_modules/@dzeio/dom-manager/dist/index.js"}],"main.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./style.css");

var Game_1 = __importDefault(require("./Game"));

var table = document.querySelector('table');

if (!table) {
  throw new Error('Table not found');
}

var game = new Game_1.default(table);
game.makeMove(0, 'red');
game.makeIATakeTurn();
game.makeMove(0, 'red');
game.makeMove(0, 'red');
game.makeMove(0, 'red');
game.makeMove(0, 'red');
game.makeMove(0, 'red');
game.makeMove(0, 'red');
game.makeMove(0, 'red');
},{"./style.css":"style.css","./Game":"Game.ts"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "42925" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=/main.c39d6dcf.js.map