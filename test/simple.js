/**
 * Log function
 *
 * @param {String} text
 */
displayLog = function (text) {
    $('.results').prepend('<div>' + text + '</div>');
    console.log(text);
};
/**
 * Clear log
 */
clearLog = function () {
    $('.results').html('');
    console.clear();
};
/**
 * Run the tests
 */
runTests = function () {

	/**
	 * Watch a scroller
	 *
	 * @param {Number} index
	 */
	var enable = function(index) {
		djs.scrollStop.watch(
			$('.scroll-cnt').eq(index),
			'scroller-'+(index+1)
		);
	};
	/**
	 * Stop watching a scroller
	 *
	 * @param {Number} index
	 */
	var disable = function(index) {
		djs.scrollStop.unwatch('scroller-'+(index+1));
	};

	//Bind callbacks
	djs.scrollStop.didLeavePosition = function($element, id, position) {
		displayLog(id + ' did leave ' + position);
	};
	djs.scrollStop.didReachPosition = function($element, id, position) {
		displayLog(id + ' did reach ' + position);
	};

	//----------------------------------------------
	// Init the resize (always first)
	djs.resize.init();

    //----------------------------------------------
    // Scrolling test
	enable(0);
	enable(1);
	enable(2);

};
/**
 * Auto run test
 */
$(document).ready(function () {
    runTests();
});