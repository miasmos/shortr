class Log {
	Say(...args) {
		if (process.env.NODE_ENV === 'production') return
		console.log(...args)
	}

	Warn(...args) {
		console.warn(...args)
	}

	Error(...args) {
		console.error(...args)
	}

	Dir(...args) {
		if (process.env.NODE_ENV !== 'production') return
		console.dir(...args)
	}
}

export let instance = new Log()