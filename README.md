tabs
====

> Accessible tabs, where aria states are automatically added.


To get Started
--------------

### CommonJS

```
$ npm install vanilla-js-tabs
```

```js
var Tabs = require('vanilla-js-tabs');
```

### Browser Global

```html
<script src="iife/tabs.js"></script>
```


Options
-------

| Option | Type | Default Value | Info |
| ------ | ---- | ------------- | ---- |
| tablist | string | '.tablist' | refers to the selector on the tablist |
| target | string | '.tab' | refers to the selector on the tabs |
| panel | string | '.panel' | refers to the selector on the tab panels |
| prefix | string | 'Tabs-' | sets the prefix for the ID/aria label if no ID is detected |
| hashEnabled | boolean | true | activates tabs based on URL hash |


API
---

```js
var tabs = new Tabs('.Tabs');

tabs.on('update', i => {
    console.log('index', i); // index 0, index 1, index 0
});

tabs.activate(0); // activates tab with a specific index
tabs.activateNext();
tabs.activatePrevious();
tabs.destroy();
```


Accessibility
-------------

[http://www.w3.org/TR/wai-aria-practices/#tabpanel](http://www.w3.org/TR/wai-aria-practices/#tabpanel)

I left out the ctrl + pageup and ctrl + pagedown interactions, since those are already used to switch between browser tabs in Firefox and Chrome.


For Developers Working on this Module
-------------------------------------

* After you pull down the project, run `npm install` to get all of the node modules
* You will want to work in the tabs.js file in the root
* To compile your changes, run `npm run build` (creates the CJS, IIFE and UMD versions of the module), then `npm run bundle-example` (creates the example file)
* To test your changes, open example/index.html in a browser


License
-------

MIT © [The C2 Group](https://c2experience.com)
