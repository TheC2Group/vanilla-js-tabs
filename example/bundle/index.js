(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * tabs-js
 * undefined
 * @version 1.0.0
 * @license MIT (c) The C2 Group (c2experience.com)
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var eventHandler = _interopDefault(require('c2-event-handler'));

'use strict';
var count = 0;
var defaults = {
  tablist: '.tablist',
  tab: '.tab',
  panel: '.panel',
  prefix: 'Tabs-',
  hashEnabled: true,
  direction: 'horizontal' // other option is 'vertical'

};
var keys = {
  left: 37,
  right: 39,
  up: 38,
  down: 40
}; // Pass in the objects to merge as arguments.
// For a deep extend, set the first argument to `true`.

var extend = function extend() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length; // Check if a deep merge

  if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
    deep = arguments[0];
    i++;
  } // Merge the object into the extended object


  var merge = function merge(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        // If deep merge and property is an object, merge properties
        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  }; // Loop through each object and conduct a merge


  for (; i < length; i++) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

var activatePrevious = function activatePrevious() {
  var previous = this.index - 1;

  if (previous < 0) {
    previous = this.len - 1;
  }

  activate.call(this, previous);
};

var activateNext = function activateNext() {
  var next = this.index + 1;

  if (next >= this.len) {
    next = 0;
  }

  activate.call(this, next);
};

var keyEvents = function keyEvents(index) {
  if (event.which === keys.left && this.opts.direction === 'horizontal') {
    event.preventDefault();
    activatePrevious.call(this, index);
    return;
  }

  if (event.which === keys.right && this.opts.direction === 'horizontal') {
    event.preventDefault();
    activateNext.call(this, index);
    return;
  }

  if (event.which === keys.up && this.opts.direction === 'vertical') {
    event.preventDefault();
    activatePrevious.call(this, index);
    return;
  }

  if (event.which === keys.down && this.opts.direction === 'vertical') {
    event.preventDefault();
    activateNext.call(this, index);
    return;
  }
};

var activate = function activate(index) {
  if (index === this.index) return;
  var previous = this.index;
  this.index = index;
  this.tabs[previous].setAttribute('aria-selected', false);
  this.tabs[previous].setAttribute('tabindex', -1);
  this.panels[previous].setAttribute('aria-hidden', true);
  this.panels[previous].setAttribute('tabindex', -1);
  this.tabs[index].setAttribute('aria-selected', true);
  this.tabs[index].setAttribute('tabindex', 0);
  this.tabs[index].focus();
  this.panels[index].setAttribute('aria-hidden', false);
  this.panels[index].setAttribute('tabindex', 0);
  this.emit('update', index);
};

var tabClickHandler = function tabClickHandler(tab, index) {
  this.activate.call(this, index);
};

var tabKeyEventHandler = function tabKeyEventHandler(tab, index) {
  this.keyEvents.call(this, index);
};

var bindEvents = function bindEvents() {
  var self = this;
  self.tabs.forEach(function (tab, index) {
    self.tabClickHandlers.push({
      tab,

      tabClickHandler() {
        tabClickHandler.call(self, tab, index);
      }

    });
    self.tabKeyEventHandlers.push({
      tab,

      tabKeyEventHandler() {
        tabKeyEventHandler.call(self, tab, index);
      }

    });
  });
  self.tabClickHandlers.forEach(function (handler) {
    handler.tab.addEventListener('click', handler.tabClickHandler);
  });
  self.tabKeyEventHandlers.forEach(function (handler) {
    handler.tab.addEventListener('keydown', handler.tabKeyEventHandler);
  });
  window.addEventListener('hashchange', function () {
    if (self.opts.hashEnabled && self._enabled) {
      checkHash.call(self);
    }
  });
};

var unbindEvents = function unbindEvents() {
  var self = this;
  self.tabClickHandlers.forEach(function (handler) {
    handler.tab.removeEventListener('click', handler.tabClickHandler);
  });
  self.tabKeyEventHandlers.forEach(function (handler) {
    handler.tab.removeEventListener('keydown', handler.tabKeyEventHandler);
  });
  this._enabled = false;
};

var addAriaAttributes = function addAriaAttributes() {
  if (!this.tablist.hasAttribute('role')) {
    this.tablist.setAttribute('role', 'tablist');
  }

  this.tabs.forEach((tab, i) => {
    var tabId = tab.getAttribute('id');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('tabindex', i === this.index ? 0 : -1);
    tab.setAttribute('aria-selected', i === this.index ? true : false);

    if (!tabId) {
      tab.setAttribute('id', this.opts.prefix + this.count + '-' + (i + 1));
    }
  });
  this.panels.forEach((panel, i) => {
    var labelledBy = panel.getAttribute('aria-labelledby');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('tabindex', i === this.index ? 0 : -1);
    panel.setAttribute('aria-hidden', i === this.index ? false : true);

    if (!labelledBy) {
      panel.setAttribute('aria-labelledby', this.opts.prefix + this.count + '-' + (i + 1));
    }
  });
};

var removeAriaAttributes = function removeAriaAttributes() {
  this.tablist.removeAttribute('role');
  this.tabs.forEach((tab, i) => {
    tab.removeAttribute('role tabindex aria-selected');
  });
  this.panels.forEach((panel, i) => {
    panel.removeAttribute('role tabindex aria-hidden');
  });
};

var destroy = function destroy() {
  removeAriaAttributes.call(this);
  unbindEvents.call(this);
};

var checkHash = function checkHash() {
  var self = this;

  if (document.location.hash) {
    // find tab with that hash
    var hashKey = document.location.hash.split('#')[1];
    self.tabs.forEach(function (tab, index) {
      if (tab.getAttribute('id') === hashKey) {
        // activate tab with that hash
        activate.call(self, index);
        return false;
      }
    });
  }
};

var Tabs = function Tabs(el, options) {
  count += 1;
  this.count = count;
  this.opts = extend(defaults, options);
  this.el = document.querySelector(el);
  this.tablist = this.el.querySelector(this.opts.tablist);
  this.tabs = this.el.querySelectorAll(this.opts.tab);
  this.panels = this.el.querySelectorAll(this.opts.panel);
  this._enabled = true;
  this.tabClickHandlers = [];
  this.tabKeyEventHandlers = [];
  this.len = this.tabs.length;
  this.index = 0;
  addAriaAttributes.call(this);
  bindEvents.call(this);

  if (this.opts.hashEnabled) {
    checkHash.call(this);
  }
};

eventHandler(Tabs);
Tabs.prototype.activate = activate;
Tabs.prototype.activateNext = activateNext;
Tabs.prototype.activatePrevious = activatePrevious;
Tabs.prototype.keyEvents = keyEvents;
Tabs.prototype.destroy = destroy;

module.exports = Tabs;

},{"c2-event-handler":3}],2:[function(require,module,exports){
var Tabs = require('../../cjs/tabs.js');

var tabs1 = new Tabs('#Example1');

tabs1.on('update', function (i) {
    console.log(i);
});

var tabs2 = new Tabs('#Example2');

document.querySelector('button.destroy').addEventListener('click', function() {
    tabs1.destroy();
});

document.querySelector('button.enable').addEventListener('click', function() {
    tabs1 = new Tabs('#Example1');
});

},{"../../cjs/tabs.js":1}],3:[function(require,module,exports){
'use strict';

var on = function (event, fn) {
    var _this = this;

    if (typeof event !== 'string' || !event.length || typeof fn === 'undefined') return;

    if (event.indexOf(' ') > -1) {
        event.split(' ').forEach(function (eventName) {
            on.call(_this, eventName, fn);
        });
        return;
    }

    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(fn);
};

var off = function (event, fn) {
    var _this2 = this;

    if (typeof event !== 'string' || !event.length) return;

    if (event.indexOf(' ') > -1) {
        event.split(' ').forEach(function (eventName) {
            off.call(_this2, eventName, fn);
        });
        return;
    }

    this._events = this._events || {};

    if (event in this._events === false) return;

    if (typeof fn === 'undefined') {
        delete this._events[event];
        return;
    }

    var index = this._events[event].indexOf(fn);
    if (index > -1) {
        if (this._events[event].length === 1) {
            delete this._events[event];
        } else {
            this._events[event].splice(index, 1);
        }
    }
};

var emit = function (event) {
    var _this3 = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var lastIndex = event.lastIndexOf(':');
    if (lastIndex > -1) {
        emit.call.apply(emit, [this, event.substring(0, lastIndex)].concat(args));
    }

    this._events = this._events || {};

    if (event in this._events === false) return;

    this._events[event].forEach(function (fn) {
        fn.apply(_this3, args);
    });
};

var EventConstructor = function () {};

var proto = EventConstructor.prototype;
proto.on = on;
proto.off = off;
proto.emit = emit;

// legacy extensions
proto.bind = on;
proto.unbind = off;
proto.trigger = emit;

var handler = function (_class) {

    // constructor
    if (arguments.length === 0) {
        return new EventConstructor();
    }

    // mixin
    if (typeof _class === 'function') {
        _class.prototype.on = on;
        _class.prototype.off = off;
        _class.prototype.emit = emit;
    }

    if (typeof _class === 'object') {
        _class.on = on;
        _class.off = off;
        _class.emit = emit;
    }

    return _class;
};

handler.EventConstructor = EventConstructor;

module.exports = handler;
},{}]},{},[2]);