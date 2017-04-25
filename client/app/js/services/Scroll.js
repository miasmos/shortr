import Observer from '../../../../core/util/Observer'
import Util from '../../../../core/util/Util'

class Scroll extends Observer {
	constructor() {
		super()

		this.directions = {
			UP: -1,
			DOWN: 1
		}

		this.lastTouch = undefined
		this.interval = setInterval(() => {
			if (!!window) {
				window.addEventListener('mousewheel', this._onscroll.bind(this))
				window.addEventListener('DOMMouseScroll', this._onscroll.bind(this))
				window.addEventListener('touchmove', this._ontouch.bind(this))
				clearTimeout(this.interval)
			}
		}, 50)
	}

	OnScroll(fn) {
		this.on('scroll', fn)
	}

	_onscroll(e) {
		if (!e) e = event;
  		e.direction = (e.detail<0 || e.wheelDelta>0) ? 1 : -1;
  		this.emit('scroll', e)
  		e.preventDefault()
	}

	_ontouch(e) {
		if (this.lastTouch) {
			e.direction = this.lastTouch.touches[0].clientY > e.touches[0].clientY ? -1 : 1
		}
		this.lastTouch = e
		this.emit('scroll', e)
	}
}

export let instance = new Scroll()