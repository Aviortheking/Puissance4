parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"iMte":[function(require,module,exports) {

},{}],"djAK":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class t{constructor(t,e){t instanceof HTMLElement?this.item=t:this.item=document.createElement(t,e)}static create(e,i){return new t(e,i)}static get(e,i){if(!(e instanceof HTMLElement)){const s=(i instanceof t?i.item:i||document).querySelector(e);if(!s)return;return new t(s)}return new t(e)}on(t,e,i){return this.item.addEventListener(t,e,i),this}off(t,e){return this.item.removeEventListener(t,e),this}text(t){return void 0!==t?(this.item.innerText=t,this):this.item.innerText}html(t){return void 0!==t?(this.item.innerHTML=t,this):this.item.innerHTML}addClass(...t){return this.item.classList.add(...t),this}setClass(...t){return this.item.classList.forEach(e=>{t.includes(e)||this.item.classList.remove(e)}),this.addClass(...t),this}classList(...t){if(!t){const t=[];return this.item.classList.forEach(e=>t.push(e)),t}return this.setClass(...t)}toggleClass(...t){for(const e of t)this.item.classList.toggle(e);return this}removeClass(...t){return this.item.classList.remove(...t),this}emit(t){return t in this.item?(this.item[t](),this):(this.item.dispatchEvent(new Event(t)),this)}attr(t,e){return void 0===e?this.item.getAttribute(t):null===e?(this.item.removeAttribute(t),this):"boolean"==typeof e?(this.item[t]=e,this):(this.item.setAttribute(t,e),this)}data(t,e){return this.attr(`data-${t}`,e)}style(t,e){return void 0===e?this.item.style[t]:(this.item.style[t]=e,this)}exist(){return!!this.item}placeBefore(e){e instanceof t&&(e=e.item);const i=e.parentElement;if(!i)throw new Error("can't place DOMElement before item because it has no parent");return i.insertBefore(this.item,e),this}placeAsChildOf(e){return e instanceof t&&(e=e.item),e.appendChild(this.item),this}place(t,e){return"before"===t?this.placeBefore(e):this.placeAsChildOf(e)}}exports.default=t;
},{}],"u1Ry":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const e=require(".");class t{constructor(e,t){this.query=e,this.source=t,this.items=[],this.refresh()}last(){return this.items[this.items.length-1]}each(e){this.items.forEach((t,s)=>e(t,s))}on(e,t,s){this.each(i=>i.on(e,t,s))}off(e,t){this.each(s=>s.off(e,t))}refresh(){this.items=[],(this.source instanceof e.DOMElement?this.source.item:this.source||document).querySelectorAll(this.query).forEach(t=>{const s=e.DOMElement.get(t);s&&this.items.push(s)})}[Symbol.iterator](){return this.items}}exports.default=t;
},{".":"jPsm"}],"jPsm":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.DOMFleetManager=exports.DOMElement=void 0;const t=e(require("./DOMElement"));exports.DOMElement=t.default;const r=e(require("./DOMFleetManager"));exports.DOMFleetManager=r.default;
},{"./DOMElement":"djAK","./DOMFleetManager":"u1Ry"}],"jKSw":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("@dzeio/dom-manager"),e=function(){function e(e){this.columns=[],this.gameStarted=!1,this.isWaitingForPlayerMove=!1,this.playerColor="red",this.gameType="single",this.table=new t.DOMElement(e),this.setupGeneral()}return e.prototype.setupGeneral=function(){var e=this;this.columns=[],new t.DOMFleetManager("tr",this.table).each(function(o,r){new t.DOMFleetManager("td",o).each(function(t,o){e.columns.length<=o&&e.columns.push([]),e.columns[o].push(t),t.text(" ").data("color",null).data("winner",null),null===t.data("event-added")&&(t.on("click",function(){e.gameStarted&&e.onPlayerMove(t,o)}),t.data("event-added","true"))}),console.log(e.columns)})},e.prototype.setRestartButton=function(t){var e=this;t.on("click",function(){e.setupGeneral(),e.startSinglePlayer()})},e.prototype.startSinglePlayer=function(){this.gameStarted=!0,this.isWaitingForPlayerMove=!0},e.prototype.setPlayerTurn=function(e){var r=this,i=t.DOMElement.get(".playerColor");i&&(i.text(e?this.playerColor:"red"===this.playerColor?"yellow":"red"),e?this.isWaitingForPlayerMove=!0:"single"===this.gameType&&this.gameStarted&&setTimeout(function(){r.makeIATakeTurn(),r.setPlayerTurn(!0)},o(200,500)))},e.prototype.setupMultiplayer=function(){},e.prototype.onPlayerMove=function(t,e){if(this.isWaitingForPlayerMove){if(this.isWaitingForPlayerMove=!this.makeMove(e,this.playerColor),this.isWaitingForPlayerMove)return;"single"===this.gameType&&this.gameStarted&&this.setPlayerTurn(!1)}},e.prototype.makeMove=function(t,e){for(var o,r=0,i=0;i<this.columns[t].length;i++){var n=this.columns[t][i],a=n.data("color");if(a||(o=n,r=i),a)break}return console.log("cellToFill",o),!!o&&(o.data("color",e),this.checkWinner(t,r),!0)},e.prototype.checkWinner=function(t,e){var o=this.checkDirection(t,e,"horizontal")||this.checkDirection(t,e,"vertical")||this.checkDirection(t,e,"diagonal-left")||this.checkDirection(t,e,"diagonal-right");if(!1===o)return console.log("FALSE"),!1;console.log(o),o.forEach(function(t){console.log(t.data("winner","true"))}),this.gameStarted=!1},e.prototype.checkDirection=function(t,e,o){console.log("Starting Check",o);var r=this.columns[t][e].data("color");if(!r)return!1;for(var i,n=[],a=0;a<4;a++){var l=t;("horizontal"===o||o.startsWith("diagonal"))&&(l=void 0!==i?t+a-i:t-a,"diagonal-left"===o&&(l=void 0!==i?t-a+i:t+a));var s=e;if(("vertical"===o||o.startsWith("diagonal"))&&(s=void 0!==i?e+a-i:e-a),console.log("index",a,"y",s,"Y exist",this.isYCorrect(s)),console.log("index",a,"x",l,"X exist",this.isXCorrect(l)),!this.isYCorrect(s)||!this.isXCorrect(l)){if(void 0===i){i=--a;continue}return!1}var c=this.columns[l][s];if(console.log("element color",c.data("color"),"color wanted",r),c.data("color")!==r){if(void 0===i){i=--a;continue}return!1}n.push(c)}return n},e.prototype.isXCorrect=function(t){return t>=0&&t<this.columns.length},e.prototype.isYCorrect=function(t){return t>=0&&t<this.columns[0].length},e.prototype.makeIATakeTurn=function(){for(var t=!1;!t;){var e=o(0,this.columns.length-1);t=this.makeMove(e,"red")}},e}();function o(t,e){return Math.floor(Math.random()*(e+1-t))+t}exports.default=e;
},{"@dzeio/dom-manager":"jPsm"}],"ZCfc":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),require("./style.css");var t=e(require("./Game")),r=require("@dzeio/dom-manager"),o=document.querySelector("table");if(!o)throw new Error("Table not found");var a=new t.default(o),l=r.DOMElement.get(".restartBtn");l&&a.setRestartButton(l),a.playerColor="yellow",a.startSinglePlayer();var n=new WebSocket("http://localhost:8080");n.onmessage=function(e){console.log(e.data)};
},{"./style.css":"iMte","./Game":"jKSw","@dzeio/dom-manager":"jPsm"}]},{},["ZCfc"], null)
//# sourceMappingURL=/main.e275d3e4.js.map