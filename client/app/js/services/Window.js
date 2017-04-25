import Observer from '../../../../core/util/Observer'
import Util from '../../../../core/util/Util'

class Window extends Observer {
	constructor() {
		super()

		this.window = window
		this.document = document
		this.body = this.document.getElementsByTagName('body')[0]
	}

	Width() {
		return this.window.innerWidth || this.document.documentElement.clientWidth || this.body.clientWidth
	}

	Height() {
		return this.window.innerHeight || this.document.documentElement.clientHeight || this.body.clientHeight
	}
}

export let instance = new Window()