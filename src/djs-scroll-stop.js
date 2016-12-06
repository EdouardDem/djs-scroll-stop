/**
 * @author Edouard Demotes-Mainard <https://github.com/EdouardDem>
 * @license http://opensource.org/licenses/BSD-2-Clause BSD 2-Clause License
 */

/**
 * Object djs for namespace
 */
window.djs = window.djs || {};

/**
 * Detects when an element reaches its end of scroll.
 * Adds CSS classes to the element and triggers callbacks.
 * This class is 'chainable'.
 *
 * @see https://github.com/EdouardDem/djs-scroll-stop
 * @requires djs.resize <https://github.com/EdouardDem/djs-resize>
 */
djs.scrollStop = {

	/* ========================================================================
	 * 	PUBLIC PROPERTIES
	 * ====================================================================== */
	/**
	 * CSS classes
	 *
	 * @const
	 * @var {Object}
	 */
	classes: {
		top: 'djs-scroll-top',
		left: 'djs-scroll-left',
		right: 'djs-scroll-right',
		bottom: 'djs-scroll-bottom'
	},
	/**
	 * Directions of scroll
	 *
	 * @var {Object}
	 */
	directions: {
		none: 0,
		horizontal: 1,
		vertical: 2,
		both: 3
	},

	/* ========================================================================
	 * 	PRIVATE PROPERTIES
	 * ====================================================================== */
	/**
	 * Namespace used to bind events
	 *
	 * @private
	 * @var {String}
	 */
	_namespace: 'djs-scroll-stop',

	/**
	 * Activate log
	 *
	 * @private
	 * @var {Boolean}
	 */
	_debug: false,

	/**
	 * Flag used to determine if the object is initialized
	 *
	 * @private
	 * @var {Boolean}
	 */
	_initialized: false,

	/**
	 * Store the width of the sidebar
	 *
	 * @private
	 * @var {Object}
	 */
	_scrollBarWidth: 0,

	/**
	 * Tolerance to detect the end (in pixel)
	 *
	 * @private
	 * @var {Object}
	 */
	_tolerance: 1,

	/**
	 * Watched elemnts
	 *
	 * @private
	 * @var {Object}
	 */
	_items: {},

	/* ========================================================================
	 * 	INITIALIZATION
	 * ====================================================================== */
	/**
	 * Init the object
	 *
	 * @private
	 * @return {Object}
	 */
	_init: function () {

		// Check if already initialized
		if (this._initialized) return this;

		// Save the scroll bar dimensions
		this._scrollBarWidth = djs.tools.ui.getScrollbarWidth();

		// Bind the events
		this._bind();

		// Set the flag to prevent another initialization
		this._initialized = true;

		// Return self
		return this;
	},
	/**
	 * Bind events
	 *
	 * @private
	 * @return {Object}
	 */
	_bind: function () {

		// Register to the resize object
		djs.resize.bind(this._namespace, function () {
			this.refresh();
		}.bind(this), djs.resize.stacks.core);

		// Return self
		return this;
	},
	/**
	 * Unbind events
	 *
	 * @private
	 * @return {Object}
	 */
	_unbind: function () {

		// Unbind from the resize
		djs.resize.unbind(this._namespace, resize.stacks.core);

		// Detach all elements
		this.unwatch();

		// Return self
		return this;
	},


	/* ========================================================================
	 * 	METHODS
	 * ====================================================================== */
	/**
	 * Watch an element
	 *
	 * @param {Object} $element    jQuery element
	 * @param {String} id
	 * @return {Object}
	 */
	watch: function ($element, id) {

		// Check if we have an id
		if (id === null) return this;

		// Auto init
		this._init();

		// If we have an element with the same id, unwatch
		this.unwatch(id);

		// We add the element
		this._items[id] = $element;

		// Bind the events
		this._items[id].bind('scroll.' + this._namespace, function () {
			this.refresh(id);
		}.bind(this));

		// Force refresh for the first time
		this.refresh(id);

		return this;
	},

	/**
	 * Stop watching one or all elements
	 *
	 * @param {String} id    (optional - null => all)
	 * @return {Object}
	 */
	unwatch: function (id) {

		// Delete all watchers ?
		if (id == null) {
			//Loop over elements
			$.each(this._items, function (i, e) {
				this.unwatch(i);
			}.bind(this));
		}

		// Delete one element
		else {

			// Check if exists
			if (this._items[id] == null)
				return this;

			// Remove classes
			this._items[id].removeClass(this.classes.top)
				.removeClass(this.classes.left)
				.removeClass(this.classes.right)
				.removeClass(this.classes.bottom);

			// Unbind the events
			this._items[id].unbind('scroll.' + this._namespace);

			// Delete from stack
			delete this._items[id];
		}

		return this;
	},

	/**
	 * Update classes of all elements and triggers callbacks
	 *
	 * @callback didReachPosition
	 * @callback didLeavePosition
	 * @param {String} id    (optional - null => all)
	 * @return {Object}
	 */
	refresh: function (id) {

		// All elements
		if (id == null) {
			$.each(this._items, function (i, e) {
				this.refresh(i);
			}.bind(this));
		}

		// One element
		else {
			// Check if defined in the stack
			if (this._items[id] == null)
				return this;

			//Pour chaque éléments
			this._items[id].each(function (i, e) {

				// Get the element
				var $el = $(e);

				// Add classes
				var top = $el.scrollTop(),
					left = $el.scrollLeft(),
					w = $el.outerWidth(),
					h = $el.outerHeight(),
					sh = $el.get(0).scrollHeight,
					sw = $el.get(0).scrollWidth,
					hasScrollVertical = sh > h,
					hasScrollHorizontal = sw > w;

				// Deal with scroll bar width
				if (hasScrollHorizontal) h -= this._scrollBarWidth;
				if (hasScrollVertical) w -= this._scrollBarWidth;

				// Guess positions
				var isTop = top <= 0 || !hasScrollVertical,
					isBottom = top >= sh - h - this._tolerance || !hasScrollVertical,
					isLeft = left <= 0 || !hasScrollHorizontal,
					isRight = left >= sw - w - this._tolerance || !hasScrollHorizontal;

				// Current classes
				var hasTop = $el.hasClass(this.classes.top),
					hasBottom = $el.hasClass(this.classes.bottom),
					hasLeft = $el.hasClass(this.classes.left),
					hasRight = $el.hasClass(this.classes.right);

				//Update classes and triggers callbacks
				// Top
				if (isTop != hasTop) {
					$el.toggleClass(this.classes.top, isTop);
					if (hasTop) this.didLeavePosition($el, id, 'top');
					else this.didReachPosition($el, id, 'top');
				}
				// Bottom
				if (isBottom != hasBottom) {
					$el.toggleClass(this.classes.bottom, isBottom);
					if (hasBottom) this.didLeavePosition($el, id, 'bottom');
					else this.didReachPosition($el, id, 'bottom');
				}
				// Left
				if (isLeft != hasLeft) {
					$el.toggleClass(this.classes.left, isLeft);
					if (hasLeft) this.didLeavePosition($el, id, 'left');
					else this.didReachPosition($el, id, 'left');
				}
				// Right
				if (isRight != hasRight) {
					$el.toggleClass(this.classes.right, isRight);
					if (hasRight) this.didLeavePosition($el, id, 'right');
					else this.didReachPosition($el, id, 'right');
				}

			}.bind(this));

		}
		return this;
	},
	/**
	 * Find the direction of the scroll of and element
	 *
	 * @param {Object} $element
	 * @return {Number}
	 * none: 0,
	 * horizontal: 1,
	 * vertical: 2,
	 * both: 3
	 *
	 * This values are stored in djs.scrollStop.directions
	 */
	getScrollDirection: function ($element) {

		// Check if element exists
		if ($element.length == 0) return this.directions.none;

		// Values
		var w = $element.outerWidth(),
			h = $element.outerHeight(),
			sh = $element.get(0).scrollHeight,
			sw = $element.get(0).scrollWidth;

		// Returns directions
		if (sh > h && sw > w) return this.directions.both;
		if (sh > h) return this.directions.vertical;
		if (sw > w) return this.directions.horizontal;
		return this.directions.none;
	},


	/* ========================================================================
	 * 	CALLBACKS
	 * ====================================================================== */
	/**
	 * Called when an element reaches a scroll stop
	 *
	 * @param {Object} $element
	 * @param {String} id
	 * @param {String} position
	 */
	didReachPosition: function ($element, id, position) {
		if (this._debug) console.log('[djs.overflow] ' + id + ' reach ' + position);
	},
	/**
	 * Called when an element leaves a scroll stop
	 *
	 * @param {Object} $element
	 * @param {String} id
	 * @param {String} position
	 */
	didLeavePosition: function ($element, id, position) {
		if (this._debug) console.log('[djs.overflow] ' + id + ' leave ' + position);
	}
};
