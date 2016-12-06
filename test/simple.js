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
		$('.enable[data-index='+index+']').addClass('hidden');
		$('.disable[data-index='+index+']').removeClass('hidden');
	};
	/**
	 * Stop watching a scroller
	 *
	 * @param {Number} index
	 */
	var disable = function(index) {
		djs.scrollStop.unwatch('scroller-'+(index+1));
		$('.enable[data-index='+index+']').removeClass('hidden');
		$('.disable[data-index='+index+']').addClass('hidden');
	};

	//Bind callbacks
	djs.scrollStop.didLeavePosition = function($element, id, position) {
		displayLog(id + ' did leave ' + position);
	};
	djs.scrollStop.didReachPosition = function($element, id, position) {
		displayLog(id + ' did reach ' + position);
	};

	//Bind actions
	$('.enable').click(function(e) {
		e.preventDefault();
		enable($(this).data('index'));
	});
	$('.disable').click(function(e) {
		e.preventDefault();
		disable($(this).data('index'));
	});

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