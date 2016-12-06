# djs-scroll-stop

JavaScript library to detect scrolling stop of an element.

This object add CSS classes to the element in order to indicate the status of the scrolling. When reaching or leaving a stop, it calls callback functions.
 
## Installation

```
bower install djs-scroll-stop
```

## Dependencies

This package requires [jQuery](http://jquery.com/), [djs-ui-tools](https://github.com/EdouardDem/djs-ui-tools) and [djs-resize](https://github.com/EdouardDem/djs-resize)

If you install it with Bower, the dependencies will be included.

## Usage

In these examples, `$element` is a jQuery DOM element that has an overflow and a scrollbar.

### Basic usage

It must be initialized after `djs.resize`.

```javascript
// Init the resize (always first)
djs.resize.init();

// Start watch the element
djs.scrollStop.watch($element, 'scroll-1');
```

This will add CSS classes to `$element` depending on its scrolling position. This classes are `djs-scroll-top`, `djs-scroll-left`, `djs-scroll-right` and `djs-scroll-bottom`.

If you want to stop watching this element, call `unwatch`.

```javascript
// Stop watching the element tqgged with 'srcoll-1'
djs.breakpoints.unwatch('scroll-1');
```

### Set callbacks

You can define a callback by setting these functions

```javascript
// Set the callback when leaving a stop
djs.scrollStop.didLeavePosition = function($element, id, position) {
    console.log(id + ' did leave ' + position);
};
// Set the callback when reaching a stop
djs.scrollStop.didReachPosition = function($element, id, position) {
    console.log(id + ' did reach ' + position);
};
```

### Force refresh

If the content of `$element` has changed and you need to force an update, you can call `refresh`.

```javascript
// This will refresh all watched elements
djs.scrollStop.refresh();

// This will refresh only one element
djs.scrollStop.refresh('scroll-1');

// This will refresh all elements and skip the callbacks
djs.scrollStop.refresh(null, true);
```

### CSS classes

If you want to change the CSS classes added to `$element`, you can set this object:

```javascript
djs.scrollStop.classes = {
    top: 'djs-scroll-top',
    left: 'djs-scroll-left',
    right: 'djs-scroll-right',
    bottom: 'djs-scroll-bottom'
}
```
