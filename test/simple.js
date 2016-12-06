/**
 * Log function
 *
 * @param {String} text
 */
displayLog = function (text) {
    $('.results').append('<div>' + text + '</div>');
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

    //----------------------------------------------
    // Dimensions test
	$('.results')
		.append('<div>Windows width as media query (including the scrollbar): ' + djs.tools.ui.getWindowWidth() + 'px</div>')
		.append('<div>Windows width only: ' + djs.tools.ui.getWindowWidth(false) + 'px</div>')
		.append('<div>Scrollbar width: ' + djs.tools.ui.getScrollbarWidth() + 'px</div>')
		.append('<div>Body has scroll bar: ' + (djs.tools.ui.bodyHasScrollbar() ? 'Yes': 'No') + '</div>');

	//----------------------------------------------
	// Directions test
	$('.scroll-cnt').each(function(i,e) {
		var direction = djs.tools.ui.getScrollDirection($(e));
		var text = "Unknown";
		if (direction === djs.tools.ui.directions.none) text = "none";
		else if (direction === djs.tools.ui.directions.horizontal) text = "horizontal";
		else if (direction === djs.tools.ui.directions.vertical) text = "vertical";
		else if (direction === djs.tools.ui.directions.both) text = "both";
		$(e).find('.inr').text(text);
	});

    //----------------------------------------------
    // Ends displayed tests
    displayLog(" ");

};
/**
 * Auto run test
 */
$(document).ready(function () {
    runTests();
});