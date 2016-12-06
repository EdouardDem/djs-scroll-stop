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
djs.overflow = {

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
		top:	'djs-scroll-top',
		left:	'djs-scroll-left',
		right:	'djs-scroll-right',
		bottom:	'djs-scroll-bottom'
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
	 * Types of scrollers
	 *
	 * @private
	 * @var {Object}
	 */
	_types: {
		none: 0,
		horizontal: 1,
		vertical: 2,
		both: 3
	},

	/**
	 * Store the width of the sidebar
	 *
	 * @private
	 * @var {Object}
	 */
	_scrollBarWidth: 0,

	/**
	 * Tolerance to detect the end
	 *
	 * @private
	 * @var {Object}
	 */
	_tolerance: 1,

	/**
	 * The jQuery body object
	 *
	 * @private
	 * @var {Object}
	 */
	_$body: null,

	/**
	 * The jQuery html & body object
	 *
	 * @private
	 * @var {Object}
	 */
	_$htmlBody: null,

	/**
	 * The jQuery window object
	 *
	 * @private
	 * @var {Object}
	 */
	_$window: null,

	/**
	 * Watched elemnts
	 *
	 * @private
	 * @var {Object}
	 */
	_items: {},



	/* ========================================================================
	 * 	INIT
	 * ====================================================================== */
	/**
	 * Init the object
	 *
	 * @return {Object}
	 */
	init: function() {

		// Check if already initialized
		if (this._initialized) return this;

		// Init resize object if needed
		djs.resize.init();

		// Init the jQuery elements
		this._$body = $('body');
		this._$htmlBody = $('html, body');
		this._$window = $(window);

		// Save the scroll bar dimensions
		this._scrollBarWidth = djs.tools.ui.getScrollbarWidth();

		// Bind the events
		this._bind();

		// Set the flag to prevent another initialization
		this._initialized = true;

		// Return self
		return this;
	},



	/* ========================================================================
	 * 	EVENTS
	 * ====================================================================== */
	/**
	 * Bind les events
	 *
	 * @private
	 * @return {Object}
	 */
	_bind: function() {

		// Register to the resize object
		djs.resize.bind(this._namespace, function() {
			this.refresh();
		}.bind(this), djs.resize.stacks.core);

		// Return self
		return this;
	},
	/**
	 * Unbind les events
	 *
	 * @private
	 * @return {Object}
	 */
	_unbind: function() {

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
	 * @param {Object} $element 	jQuery element
	 * @param {String} id
	 * @return {Object}
	 */
	watch: function($element, id) {

		// Check if we have an id
		if (id === null) return this;

		// If we have an element with the same id, unwatch
		this.unwatch(id);

		// We add the element
		this._items[id] = $element;

		// Bind the events
		this._items[id].bind('scroll.'+this._namespace, function() {
			this.refresh(id);
		}.bind(this));

		// Force refresh for the first time
		this.refresh(id);

		return this;
	},

	/**
	 * Stop watching one or all elements
	 *
	 * @param {String} id	(optional - null => all)
	 * @return {Object}
	 */
	unwatch: function(id) {

		// Delete all watchers ?
		if (id==null) {
			//Loop over elements
			$.each(this._items, function(i,e){
				this.unwatch(i);
			}.bind(this));
		}

		// Delete one elemenet
		else {

			// Check if exists
			if (this._items[id]==null)
				return this;

			// Remove classes
			this._items[id].removeClass(this.classes.top)
				.removeClass(this.classes.left)
				.removeClass(this.classes.right)
				.removeClass(this.classes.bottom);

			// Unbind the events
			this._items[id].unbind('scroll.'+this._namespace);

			// Delete from stack
			delete this._items[id];
		}

		return this;
	},

	/**
	 * Met a jour les classes pour tous les élements
	 *
	 * @callback didReachPosition
	 * @callback didLeavePosition
	 * @param {String} id (optionnel)
	 * @return {Object}
	 */
	refresh: function(id) {
		if (id==null) {
			//Tout les elements
			$.each(this._items, function(i,e){
				this.refresh(i);
			}.bind(this));
		} else {
			//Vérifie
			if (this._items[id]==null)
				return this;

			//Pour chaque éléments
			this._items[id].each(function(i,e) {

				//l'element
				var $el = $(e);
				//ajoute les classes
				var top 	= $el.scrollTop(),
					left 	= $el.scrollLeft(),
					w 		= $el.outerWidth(),
					h 		= $el.outerHeight(),
					sh 		= $el.get(0).scrollHeight,
					sw 		= $el.get(0).scrollWidth,
					hasScrollVertical 	= sh > h,
					hasScrollHorizontal = sw > w;

				//Correction en fonction de la scrollbar
				if (hasScrollHorizontal) h -= this._scrollBarWidth;
				if (hasScrollVertical) w -= this._scrollBarWidth;

				//Positions
				var isTop 		= top<=0 || !hasScrollVertical,
					isBottom 	= top>=sh-h-this._tolerance || !hasScrollVertical,
					isLeft		= left<=0 || !hasScrollHorizontal,
					isRight		= left>=sw-w-this._tolerance || !hasScrollHorizontal;

				//Current classes
				var hasTop		= $el.hasClass(this.classes.top),
					hasBottom	= $el.hasClass(this.classes.bottom),
					hasLeft		= $el.hasClass(this.classes.left),
					hasRight	= $el.hasClass(this.classes.right);

				//Top
				if (isTop != hasTop) {
					$el.toggleClass(this.classes.top, isTop);
					if (hasTop) this.didLeavePosition($el, id, 'top');
					else this.didReachPosition($el, id, 'top');
				}
				//Bottom
				if (isBottom != hasBottom) {
					$el.toggleClass(this.classes.bottom, isBottom);
					if (hasBottom) this.didLeavePosition($el, id, 'bottom');
					else this.didReachPosition($el, id, 'bottom');
				}
				//Left
				if (isLeft != hasLeft) {
					$el.toggleClass(this.classes.left, isLeft);
					if (hasLeft) this.didLeavePosition($el, id, 'left');
					else this.didReachPosition($el, id, 'left');
				}
				//Right
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
	 * Indique si l'élement a un scroll
	 *
	 * @param {Object} $element
	 * @return {Integer}
	 */
	getType: function($element) {
		//Vérifie
		if ($element.length==0) return this._types.none;
		//Valeurs
		var w 		= $element.outerWidth(),
			h 		= $element.outerHeight(),
			sh 		= $element.get(0).scrollHeight,
			sw 		= $element.get(0).scrollWidth;
		//Retour
		if (sh > h && sw > w) return this._types.both;
		if (sh > h) return this._types.vertical;
		if (sw > w) return this._types.horizontal;
		return this._types.none;
	},



	/* ========================================================================
	 * 	CALLBACKS
	 * ====================================================================== */
	/**
	 * Appelé lorsqu'un élément atteind une position
	 *
	 * @param {Object} $element
	 * @param {String} id
	 * @param {String} position
	 */
	didReachPosition: function($element, id, position) {
		if (this._debug) console.log('[Overflow] '+id+' reach '+position);
	},
	/**
	 * Appelé lorsqu'un élément quitte une position
	 *
	 * @param {Object} $element
	 * @param {String} id
	 * @param {String} position
	 */
	didLeavePosition: function($element, id, position) {
		if (this._debug) console.log('[Overflow] '+id+' leave '+position);
	},
};
