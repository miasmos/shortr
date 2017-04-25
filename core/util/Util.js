export default class Utils {
	static debounce(func, wait, immediate) {
		//makes sure that a function isn't called more often than the wait parameter specifies
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		}
	}

	static rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}