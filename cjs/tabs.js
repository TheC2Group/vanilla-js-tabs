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
