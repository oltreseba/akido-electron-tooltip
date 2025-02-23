# Akido Electron tooltip

## Introduction
This module is a fork of [Electron tooltip](https://www.npmjs.com/package/electron-tooltip), with improved support for the lastest version of electron (>5).

The documentation is the same. The name has changed.

## Description

This module is intended to be used in [Electron applications](https://electron.atom.io/). It allows for tooltips to flow outside the window bounds they're called from.

<img src="https://raw.githubusercontent.com/mdings/electron-tooltip/master/sample.gif" width="500" />

## Installation

```javascript
npm i akido-electron-tooltip
```

## Usage
After importing the module, it will search for elements that have the data-tooltip attribute attached. A configuration object can be passed in when calling the tooltip function.

```javascript
// in the render process..
const tt = require('akido-electron-tooltip')
tt({
  // config properties
})
```
Position, width and offset options can be overriden on a per element basis by using the data-tooltip-{option} attribute.

```html
<!-- basic example: -->
<a href="http://www.facebook.com" data-tooltip="Go to Facebook" data-tooltip-position="bottom"></a>
```

### Configuration options

|option|description|default|values|
|---|---|---|---|
|position|Tooltip direction|top|left, top, right, bottom|
|width|Width of the tooltip. If width is set to auto, the tooltip will not wrap content|auto|> 0|
|offset|Offset from the element to the tooltip|0|> 0|
|style|Object for overwriting default styles|{}||
|customContent|Function that will be called each time the tooltip is shown. Takes two arguments: the element on which it was called, and the current value of `data-tooltip`. It should return a string which will be used instead of the `data-tooltip` value|undefined||
|level|It's possible to specify the level of the tooltip (check: https://electronjs.org/docs/api/browser-window#winsetalwaysontopflag-level-relativelevel)|'floating'| 'normal' \| 'floating' \| 'torn-off-menu' \| 'modal-panel' \| 'main-menu' \| 'status' \| 'pop-up-menu' \| 'screen-saver'||
|relativeLevel|It's possible to specify the relative level of the tooltip (check: https://electronjs.org/docs/api/browser-window#winsetalwaysontopflag-level-relativelevel)|0|integer|

```javascript
// example
// in the render process..
const tt = require('akido-electron-tooltip')
tt({
  position: 'bottom',
  width: 200,
  style: {
    backgroundColor: '#f2f3f4',
    borderRadius: '4px'
  },
  level: 'pop-up-menu',
  relativeLevel: 2 
})
